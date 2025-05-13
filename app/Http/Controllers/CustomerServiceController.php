<?php

namespace App\Http\Controllers;

use App\Exports\CustomerServicesExport;
use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelType;

class CustomerServiceController extends Controller
{
    public function index(Request $request)
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
        $customerServices=$query->paginate(config('common.paginate_per_page'))->appends($request->all());

        $statusLabels = collect(config('common.service_statuses'))->pluck('label', 'value')->all();
        foreach ($customerServices as $item) {
            $item->status = $statusLabels[$item->status] ?? $item->status;
        }

        $services = Service::where('created_by',$authUser->id)->get();

        return inertia('CustomerServices/Index', [
            'customerServices' => $customerServices,
            'filters' => $request->only(['name','service_id', 'status']),
            'services' => $services,
            'statuses' => config('common.service_statuses'),
        ]);
    }


    public function create()
    {
        $services = Service::where('created_by',Auth::id())->get();

        return Inertia::render('CustomerServices/Form', [
            'customers' => Customer::with('user')->get(),
            'services' => $services,
            'statuses' => config('common.service_statuses'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'service_id' => 'required|exists:services,id',
            'status' => 'required',
           // 'start_date' => 'nullable|date',
           // 'end_date' => 'nullable|date|after_or_equal:start_date',
            'remark' => 'nullable|string',
        ]);

        CustomerService::create([
            'customer_id' => $request->customer_id,
            'service_id' => $request->service_id,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'remark' => $request->remark,
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('customer-services.index')->with('success', 'Customer Service created successfully.');
    }

    public function edit(CustomerService $customerService)
    {
        $services = Service::where('created_by',Auth::id())->get();
        
        return Inertia::render('CustomerServices/Form', [
            'customerService' => $customerService->load(['customer.user', 'service']),
            'customers' => Customer::with('user')->get(),
            'services' => $services,
            'statuses' => config('common.statuses'),
        ]);
    }

    public function update(Request $request, CustomerService $customerService)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'service_id' => 'required|exists:services,id',
            'status' => 'required|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'remark' => 'nullable|string',
        ]);

        $customerService->update([
            'customer_id' => $request->customer_id,
            'service_id' => $request->service_id,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'remark' => $request->remark,
            'updated_by' => Auth::id(),
        ]);

        return redirect()->route('customer-services.index')->with('success', 'Customer Service updated successfully.');
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



}
