<?php

namespace App\Http\Controllers;

use App\Exports\CustomerServicesExport;
use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\CustomerServiceHistory;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelType;

class CustomerServiceController extends Controller
{
    public function index(Request $request)
    {
        $authUser = auth()->user();
        $query = CustomerService::with(['customer.user', 'service', 'creator'])
            ->whereHas('service', function ($q) use ($authUser) {
                $q->where('created_by', $authUser->id); 
            });

        if ($request->filled('customer_id')) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_id', $request->customer_id)
                ->orWhereHas('customer', function ($q2) use ($request) {
                    $q2->where('customer_id', $request->customer_id); 
                });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        $customerServices = $query->paginate(config('common.paginate_per_page'))
                                ->appends($request->all());

        $statusLabels = collect(config('common.service_statuses'))->pluck('label', 'value')->all();
        foreach ($customerServices as $item) {
            $item->status = $statusLabels[$item->status] ?? $item->status;
        }

        $services = Service::where('created_by', $authUser->id)->get();
        $customers = Customer::with('user')->where('created_by', $authUser->id)->get();

        $includedStatusValues = [1, 2, 3, 4, 9];

        $statusCounts = CustomerService::select('status')
            ->where('created_by', $authUser->id)
            ->selectRaw('COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Ensure all statuses exist (even if 0)
        $allStatuses = config('common.service_statuses');
        $allSummaryStatuses = array_filter(config('common.service_statuses'), function ($status) use ($includedStatusValues) {
            return in_array($status['value'], $includedStatusValues);
        });

        $summary = [];
        foreach ($allSummaryStatuses as $status) {
            $summary[$status['label']] = $statusCounts[$status['value']] ?? 0;
        }


        return inertia('CustomerServices/Index', [
            'customerServices' => $customerServices,
            'customers' => $customers,
            'services' => $services,
            'statuses' => $allStatuses,
            'filters' => $request->only(['customer_id', 'status', 'service_id']), 
            'statusSummary' => $summary,
            'pageTitle' => 'activeServiceActivity',
        ]);
    }



    public function create()
    {
        $services = Service::where('created_by',Auth::id())->get();
        $customers = Customer::with('user')->where('created_by',Auth::id())->get();

        $allStatuses = config('common.service_statuses');

        $filteredStatuses = array_values(array_filter($allStatuses, function ($status) {
            return $status['value'] != 1;
        }));


        return Inertia::render('CustomerServices/Form', [
            'customers' => $customers,
            'services' => $services,
            'statuses' => $filteredStatuses,
            'genders' => config('common.genders'),
            'states' => config('common.states'),
            'townships' => config('common.townships'),
            'citizens' => config('common.citizens'),
            'pageTitle' => 'createServiceActivity'
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateForm($request);

        $service = Service::with(['category', 'subcategory'])->find($data['service_id']);
        if ($service && $service->category && strtolower($service->category->name) === 'visa') {
            $visaType = $service->subcategory ? $service->subcategory->name : null;
        } else {
            $visaType = null;
        }

        $customer = Customer::findOrFail($data['customer_id']);

        $updateData = array_merge(
            $this->extractCustomerFields($data),
            [
                'cus_id'      => $data['name_eng'] . "-" . $data['dob'],
                'phone' => $data['phone_primary'],
                'address' => $data['current_address'],
                'passport_expiry' => $data['passport_expiry_date'],
                'visa_expiry' => $data['visa_expiry_date'],
                'ci_expiry' => $data['ci_expiry_date'],
                'pink_card_expiry' => $data['pink_card_expiry_date'],
            ]
        );
        if ($visaType !== null) {
            $updateData['visa_type'] = $visaType;
        }
        $customer->update($updateData);


        if ($customer->user) {
            $customer->user->update([
                'name' => $data['name_eng'],
                'email' => $data['email']
            ]);
        }

        // Create customer service
        $customerService=CustomerService::create([
            'customer_id' => $customer->id,
            'service_id' => $data['service_id'],
            'status' => $data['status'],
            'reject_note' => $data['reject_note'] ?? null,
            'created_by' => Auth::id(),
        ]);

        //save history
        CustomerServiceHistory::create([
            'customer_service_id' => $customerService->id,
            'status' => $data['status'],
            'note' => $data['reject_note'] ?? null,
            'changed_by' => Auth::id(),
        ]);

        return redirect()->route('customer-services.index')->with('success', 'Customer service created successfully.');
    }


    public function edit(CustomerService $customerService)
    {
        $services = Service::where('created_by',Auth::id())->get();
        $customers = Customer::with('user')->where('created_by',Auth::id())->get();

        $allStatuses = config('common.service_statuses');
        $currentStatus = $customerService->status;

        $filteredStatuses = array_values(array_filter($allStatuses, function ($status) use ($currentStatus) {
            if ($currentStatus == 3) { //after payment confirmed , skip reject
                return $status['value'] >= $currentStatus && $status['value'] != 4;
            }
            return $status['value'] >= $currentStatus;
        }));

        $longUrl = url("/customer-services/view/{$customerService->id}");
        Log::info("Long URL: " . $longUrl);

        //$shortUrl = generateBitlyUrl($longUrl);
        $shortUrl = generateShortUrl($longUrl);
        Log::info("Short URL: " . $shortUrl);
        
        if ($shortUrl=="") {
            $shortUrl = $longUrl;
        }

        
        return Inertia::render('CustomerServices/Form', [
            'customerService' => $customerService->load(['customer.user', 'service']),
            'customers' => $customers,
            'services' => $services,
            'statuses' => $filteredStatuses,
            'genders' => config('common.genders'),
            'states' => config('common.states'),
            'townships' => config('common.townships'),
            'citizens' => config('common.citizens'),
            'service_url' => $shortUrl,
            'pageTitle' => 'editServiceActivity'
        ]);
    }

    public function update(Request $request, CustomerService $customerService)
    {
        $data = $this->validateForm($request);

        // Update customer info
        $customer = Customer::findOrFail($data['customer_id']);
        $customer->update(array_merge(
            $this->extractCustomerFields($data),
            ['cus_id' => $data['name_eng'] . "-" . $data['dob']] ,
            ['phone' => $data['phone_primary']] ,
            ['address' => $data['current_address']] ,
            ['passport_expiry' => $data['passport_expiry_date']] ,
            ['visa_expiry' => $data['visa_expiry_date']] ,
            ['ci_expiry' => $data['ci_expiry_date']] ,
            ['pink_card_expiry' => $data['pink_card_expiry_date']] ,
        ));

        // Update user name
        if ($customer->user) {
           $customer->user->update([
                'name' => $data['name_eng'],
                'email' => $data['email']
            ]);
        }

        // Check if status changed
        $statusChanged = $customerService->status != $data['status'];

        // Update customer service
        $customerService->update([
            'service_id' => $data['service_id'],
            'status' => $data['status'],
            'reject_note' => $data['reject_note'] ?? null,
            'updated_by' => Auth::id(),
        ]);

        // Save history if status changed
        if ($statusChanged) {
            CustomerServiceHistory::create([
                'customer_service_id' => $customerService->id,
                'status' => $data['status'],
                'note' => $data['reject_note'] ?? null,
                'changed_by' => Auth::id(),
            ]);
        }

        return redirect()->route('customer-services.index')->with('success', 'Customer service updated successfully.');
    }


    public function destroy(CustomerService $customerService)
    {
        $customerService->delete();

        return redirect()->route('customer-services.index')->with('success', 'Customer Service deleted successfully.');
    }

    public function export(Request $request)
    {
        $authUser = auth()->user();
        $query = CustomerService::with(['customer.user', 'service']);

        if ($request->filled('name')) {
            $query->whereHas('customer.user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->name . '%');
            });
        }

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->filled('status') && $request->status != 0) {
            $query->where('status', $request->status);
        }

        $query->where('created_by',$authUser->id);
        $customerServices = $query->get();

        $statusLabels = collect(config('common.service_statuses'))->pluck('label', 'value')->all();
        foreach ($customerServices as $item) {
            $item->status = $statusLabels[$item->status] ?? $item->status;
        }

        return Excel::download(new CustomerServicesExport($customerServices), 'customer-services.csv', ExcelType::CSV);
    }

    private function validateForm(Request $request)
    {
        return $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'name_eng' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore(Customer::find($request->customer_id)?->user_id),
            ],
            'phone_primary' => 'required|string|max:20',
            'dob' => 'nullable|date',
            'current_address' => 'nullable|string|max:255',
            'name_mm' => 'nullable|string|max:255',
            'nationality' => 'nullable|string|max:100',
            'sex' => 'nullable|string|max:10',
            'nrc_no' => 'nullable|string|max:50',
            'passport_no' => 'nullable|string|max:50',
            'passport_expiry_date' => 'nullable|date',
            'visa_type' => 'nullable|string|max:50',
            'visa_expiry_date' => 'nullable|date',
            'ci_no' => 'nullable|string|max:50',
            'ci_expiry_date' => 'nullable|date',
            'pink_card_no' => 'nullable|string|max:50',
            'pink_card_expiry_date' => 'nullable|date',
            'phone_secondary' => 'nullable|string|max:20',
            'service_id' => 'required|exists:services,id',
            'status' => 'required|integer',
            'reject_note' => 'nullable'
        ]);
    }


    private function extractCustomerFields($data)
    {
        return collect($data)->only([
            'name_mm', 
            'sex', 
            'dob', 
            'nrc_no', 
            'nationality',
            'passport_no', 
            'visa_type',
            'ci_no', 
            'pink_card_no',
            'phone_secondary', 
        ])->toArray();
    }

    public function view($id)
    {
        $customerService = CustomerService::with(['customer.user', 'service.category'])->findOrFail($id);

        $agentData = User::with('agent')->findOrFail($customerService->service->created_by);

        return Inertia::render('CustomerServices/View', [
            'customerService' => $customerService,
            'agentData' => $agentData, 
            'service_statuses' => config('common.service_statuses')
        ]);

    }
    

}
