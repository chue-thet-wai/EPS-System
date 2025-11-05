<?php

namespace App\Http\Controllers;

use App\Exports\CustomerImportFormatExport;
use App\Exports\CustomersExport;
use App\Imports\CustomersImport;
use App\Models\Customer;
use App\Models\CustomerAttachment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelType;
use Illuminate\Validation\ValidationException;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $authUser = auth()->user();
        $query = Customer::with('user');

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
    
        /*if ($request->filled('name')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->name . '%');
            });
        }
    
        if ($request->filled('phone')) {
            $query->where('phone', 'like', '%' . $request->phone . '%');
        }*/

        $query->where('created_by',$authUser->id);

        $customers = $query->paginate(config('common.paginate_per_page'))->appends($request->all());

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['customer_id']),
            'pageTitle' => 'allCustomers',
        ]);
    }

    /*public function expiry(Request $request)
    {
        $type = $request->input('type', 'passport');
        $authUser = auth()->user();

        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        // Get counts for each expiry type
        $expiryCounts = [
            'passport' => Customer::where('created_by',$authUser->id)
                ->whereNotNull('passport_expiry')
                ->whereBetween('passport_expiry', [$startOfMonth, $endOfMonth])
                ->count(),

            'visa' => Customer::where('created_by',$authUser->id)
                ->whereNotNull('visa_expiry')
                ->whereBetween('visa_expiry', [$startOfMonth, $endOfMonth])
                ->count(),

            'pinkcard' => Customer::where('created_by',$authUser->id)
                ->whereNotNull('pink_card_expiry')
                ->whereBetween('pink_card_expiry', [$startOfMonth, $endOfMonth])
                ->count(),

            'ci' => Customer::where('created_by',$authUser->id)
                ->whereNotNull('ci_expiry')
                ->whereBetween('ci_expiry', [$startOfMonth, $endOfMonth])
                ->count(),
        ];

        $query = Customer::where('created_by',$authUser->id)
            ->when($type === 'passport', function ($query) use ($startOfMonth, $endOfMonth) {
                $query->whereNotNull('passport_expiry')
                    ->whereBetween('passport_expiry', [$startOfMonth, $endOfMonth]);
            })
            ->when($type === 'visa', function ($query) use ($startOfMonth, $endOfMonth) {
                $query->whereNotNull('visa_expiry')
                    ->whereBetween('visa_expiry', [$startOfMonth, $endOfMonth]);
            })
            ->when($type === 'pinkcard', function ($query) use ($startOfMonth, $endOfMonth) {
                $query->whereNotNull('pink_card_expiry')
                    ->whereBetween('pink_card_expiry', [$startOfMonth, $endOfMonth]);
            })
            ->when($type === 'ci', function ($query) use ($startOfMonth, $endOfMonth) {
                $query->whereNotNull('ci_expiry')
                    ->whereBetween('ci_expiry', [$startOfMonth, $endOfMonth]);
            });
            if ($request->filled('customer_id')) {
                $query->where('customer_id', $request->customer_id);
            }

            $customers=$query->with('user') 
                             ->paginate(config('common.paginate_per_page'));


        return Inertia::render('Customers/ExpirationThisMonth', [
            'customers' => $customers,
            'activeType' => $type,
            'filters' => $request->only(['customer_id']),
            'expiryCounts' => $expiryCounts,
            'pageTitle' => 'Customer Expirations this Month',
        ]);
    }*/
    
    public function expiry(Request $request)
    {
        $authUser = auth()->user();
        $type=$request->type;

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $field = match ($type) {
            'passport' => 'passport_expiry',
            'visa' => 'visa_expiry',
            'pinkcard' => 'pink_card_expiry',
            'ci' => 'ci_expiry',
            default => 'passport_expiry',
        };

        $today = Carbon::today();
        $endOfWeek = Carbon::now()->endOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $expiryCounts = Customer::where('created_by', $authUser->id)
            ->whereNotNull($field)
            ->selectRaw("
                SUM(CASE WHEN $field < ? THEN 1 ELSE 0 END) as expired,
                SUM(CASE WHEN $field = ? THEN 1 ELSE 0 END) as today,
                SUM(CASE WHEN $field BETWEEN ? AND ? THEN 1 ELSE 0 END) as week,
                SUM(CASE WHEN $field BETWEEN ? AND ? THEN 1 ELSE 0 END) as month
            ", [
                $today, $today, $today, $endOfWeek, $startOfMonth, $endOfMonth
            ])
            ->first();

        // Filter customers by date range
       $query = Customer::where('created_by', $authUser->id)
            ->whereNotNull($field)
            ->when($startDate && $endDate, function ($q) use ($field, $startDate, $endDate) {
                $q->whereBetween($field, [$startDate, $endDate]);
            })
            ->when(!$startDate && $endDate, function ($q) use ($field, $endDate) {
                $q->where($field, '<=', $endDate);
            })
            ->when(!$startDate && !$endDate, function ($q) use ($field, $today) {
                $q->where($field, '<', $today); 
            });



        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        $customers = $query->with('user')->paginate(config('common.paginate_per_page'));

        $pageTitleMap = [
            'passport' => 'passportExpiry',
            'visa' => 'visaExpiry',
            'pinkcard' => 'pinkCardExpiry',
            'ci' => 'ciCardExpiry',
        ];

        $pageTitle = $pageTitleMap[$type] ?? 'CustomerExpirations';

        return Inertia::render('Customers/CustomerExpiration', [
            'customers' => $customers,
            'activeType' => $type,
            'filters' => $request->only(['customer_id', 'start_date', 'end_date']),
            'expiryCounts' => $expiryCounts,
            'pageTitle' => $pageTitle,
        ]);
    }



    public function newCustomersThisMonth(Request $request)
    {
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $authUser = auth()->user();

        $query = Customer::where('created_by',$authUser->id)
        ->where('created_at', '>=', $startOfMonth);
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        $customers=$query->with('user') 
                        ->paginate(config('common.paginate_per_page'));


        return Inertia::render('Customers/CustomersThisMonth', [
            'customers' => $customers,
            'filters' => $request->only(['customer_id']),
            'pageTitle' => 'newCustomersThisMonth'
        ]);
    }



    public function create()
    {
        return Inertia::render('Customers/Form', [
            'statuses' => config('common.statuses'),
            'genders' => config('common.genders'),
            'states' => config('common.states'),
            'townships' => config('common.townships'),
            'citizens' => config('common.citizens'),
            'pageTitle' => 'createCustomer'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name_eng' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone_primary' => 'required|string|max:20',
            'dob' => 'required|date',
            'expired_date' => 'nullable|date',
            'current_address' => 'nullable|string',
            'name_mm' => 'nullable|string|max:255',
            'nationality' => 'nullable|string|max:100',
            'sex' => 'nullable|string|max:10',
            'nrc_no' => 'nullable|string|max:50',
            'prev_passport_no' => 'nullable|string|max:50',
            'passport_no' => 'nullable|string|max:50',
            'passport_expiry' => 'nullable|date',
            'visa_type' => 'nullable|string|max:50',
            'visa_expiry' => 'nullable|date',
            'ci_no' => 'nullable|string|max:50',
            'ci_expiry' => 'nullable',
            'pink_card_no' => 'nullable|string|max:50',
            'pink_card_expiry' => 'nullable|date',
            'phone_secondary' => 'nullable|string|max:20',
            'scan_images.passport' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'scan_images.visa' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'scan_images.ci' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'scan_images.pink_card' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'documents.*' => 'nullable|file|max:5120',  
            'attachments_to_delete' => 'nullable|array', 
            'attachments_to_delete.*' => 'integer',
        ]);  

        // Create user
        $user = User::create([
            'name' => $request->name_eng,
            'email' => $request->email,
            'password' => Hash::make($request->name_eng . "-" . $request->dob),
        ]);

        $user->assignRole('Customer');

        // Generate customer ID
        $customerID = generateCustomerID();

        // Create customer record
        $customer = $user->customer()->create([
            'customer_id'        => $customerID,
            'cus_id'             => $request->name_eng . "-" . $request->dob,
            'name_mm'            => $request->name_mm,
            'nationality'        => $request->nationality,
            'dob'                => $request->dob,
            'sex'                => $request->sex,
            'nrc_no'             => $request->nrc_no,
            'prev_passport_no'   => $request->prev_passport_no,
            'passport_no'        => $request->passport_no,
            'passport_expiry'    => $request->passport_expiry,
            'visa_type'          => $request->visa_type,
            'visa_expiry'        => $request->visa_expiry,
            'ci_no'              => $request->ci_no,
            'ci_expiry'          => $request->ci_expiry,
            'pink_card_no'       => $request->pink_card_no,
            'pink_card_expiry'   => $request->pink_card_expiry,
            'phone'              => $request->phone_primary,
            'phone_secondary'    => $request->phone_secondary,
            'address'            => $request->current_address,
            'created_by'         => Auth::id(),
        ]);

        $folderPath = public_path('assets/images/customers');

        // Make sure the directory exists
        if (!file_exists($folderPath)) {
            mkdir($folderPath, 0775, true);
        }

        // Passport Image
        if ($request->hasFile('scan_images.passport')) {
            $passportFile = $request->file('scan_images.passport');
            $passportExt = $passportFile->getClientOriginalExtension();
            $passportImage = $customerID . '_passport.' . $passportExt;
            $passportFile->move($folderPath, $passportImage);
        } else {
            $passportImage = null;
        }

        // Visa Image
        if ($request->hasFile('scan_images.visa')) {
            $visaFile = $request->file('scan_images.visa');
            $visaExt = $visaFile->getClientOriginalExtension();
            $visaImage = $customerID . '_visa.' . $visaExt;
            $visaFile->move($folderPath, $visaImage);
        } else {
            $visaImage = null;
        }

        // CI Image
        if ($request->hasFile('scan_images.ci')) {
            $ciFile = $request->file('scan_images.ci');
            $ciExt = $ciFile->getClientOriginalExtension();
            $ciImage = $customerID . '_ci.' . $ciExt;
            $ciFile->move($folderPath, $ciImage);
        } else {
            $ciImage = null;
        }

        // Pink Card Image
        if ($request->hasFile('scan_images.pink_card')) {
            $pinkFile = $request->file('scan_images.pink_card');
            $pinkExt = $pinkFile->getClientOriginalExtension();
            $pinkCardImage = $customerID . '_pinkcard.' . $pinkExt;
            $pinkFile->move($folderPath, $pinkCardImage);
        } else {
            $pinkCardImage = null;
        }
      

        $customer->images()->create([
            'customer_id'    => $customerID,
            'passport_image' => $passportImage,
            'visa_image' => $visaImage,
            'ci_image' => $ciImage,
            'pinkcard_image' => $pinkCardImage,
        ]);

        // Handle new uploaded documents
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $extension = $file->getClientOriginalExtension();
                $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) 
                            . '_' . $customerID . '.' . $extension;

                $path = $file->storeAs("eps/customer_attachments", $filename, 's3');

                $customer->attachments()->create([
                    'file_name' => $filename,
                    'file_path' => $path,
                ]);
            }
        }

        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }


    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Form', [
            'customer' => $customer->load(['user', 'attachments']),
            'statuses' => config('common.statuses'),
            'genders' => config('common.genders'),
            'states' => config('common.states'),
            'townships' => config('common.townships'),
            'citizens' => config('common.citizens'),
            'pageTitle'=>'editCustomer'
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name_eng' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $customer->user->id,
            'phone_primary' => 'required|string|max:20',
            'dob' => 'nullable|date',
            'current_address' => 'nullable|string',
            'name_mm' => 'nullable|string|max:255',
            'nationality' => 'nullable|string|max:100',
            'sex' => 'nullable|string|max:10',
            'nrc_no' => 'nullable|string|max:50',
            'prev_passport_no' => 'nullable|string|max:50',
            'passport_no' => 'nullable|string|max:50',
            'passport_expiry' => 'nullable|date',
            'visa_type' => 'nullable|string|max:50',
            'visa_expiry' => 'nullable|date',
            'ci_no' => 'nullable|string|max:50',
            'ci_expiry' => 'nullable|date',
            'pink_card_no' => 'nullable|string|max:50',
            'pink_card_expiry' => 'nullable|date',
            'phone_secondary' => 'nullable|string|max:20',
            'scan_images.passport' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'scan_images.visa' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'scan_images.ci' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'scan_images.pink_card' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'documents.*' => 'nullable|file|max:5120',
            'attachments_to_delete' => 'nullable|array',
            'attachments_to_delete.*' => 'integer',
        ]);

        // Update user
        $customer->user->update([
            'name' => $request->name_eng,
            'email' => $request->email,
        ]);

        // Update customer details
        $customer->update([
            'cus_id'           => $request->name_eng . "-" . $request->dob,
            'phone'            => $request->phone_primary,
            'dob'              => $request->dob,
            'address'          => $request->current_address,
            'name_mm'          => $request->name_mm,
            'nationality'      => $request->nationality,
            'sex'              => $request->sex,
            'nrc_no'           => $request->nrc_no,
            'prev_passport_no' => $request->prev_passport_no,
            'passport_no'      => $request->passport_no,
            'passport_expiry'  => $request->passport_expiry,
            'visa_type'        => $request->visa_type,
            'visa_expiry'      => $request->visa_expiry,
            'ci_no'            => $request->ci_no,
            'ci_expiry'        => $request->ci_expiry,
            'pink_card_no'     => $request->pink_card_no,
            'pink_card_expiry' => $request->pink_card_expiry,
            'phone_secondary'  => $request->phone_secondary,
            'updated_by'       => Auth::id(),
        ]);

        $customerID = $customer->customer_id;
        $folderPath = public_path('assets/images/customers');

        if (!file_exists($folderPath)) {
            mkdir($folderPath, 0775, true);
        }

        $images = $customer->images ?? $customer->images()->create([]); // Create if not exists

        // Passport
        if ($request->hasFile('scan_images.passport')) {
            // Delete old image
            if ($images->passport_image && file_exists($folderPath . '/' . $images->passport_image)) {
                unlink($folderPath . '/' . $images->passport_image);
            }

            $file = $request->file('scan_images.passport');
            $ext = $file->getClientOriginalExtension();
            $filename = $customerID . '_passport.' . $ext;
            $file->move($folderPath, $filename);
            $images->passport_image = $filename;
        }

        // Visa
        if ($request->hasFile('scan_images.visa')) {
            if ($images->visa_image && file_exists($folderPath . '/' . $images->visa_image)) {
                unlink($folderPath . '/' . $images->visa_image);
            }

            $file = $request->file('scan_images.visa');
            $ext = $file->getClientOriginalExtension();
            $filename = $customerID . '_visa.' . $ext;
            $file->move($folderPath, $filename);
            $images->visa_image = $filename;
        }

        // CI
        if ($request->hasFile('scan_images.ci')) {
            if ($images->ci_image && file_exists($folderPath . '/' . $images->ci_image)) {
                unlink($folderPath . '/' . $images->ci_image);
            }

            $file = $request->file('scan_images.ci');
            $ext = $file->getClientOriginalExtension();
            $filename = $customerID . '_ci.' . $ext;
            $file->move($folderPath, $filename);
            $images->ci_image = $filename;
        }

        // Pink Card
        if ($request->hasFile('scan_images.pink_card')) {
            if ($images->pinkcard_image && file_exists($folderPath . '/' . $images->pinkcard_image)) {
                unlink($folderPath . '/' . $images->pinkcard_image);
            }

            $file = $request->file('scan_images.pink_card');
            $ext = $file->getClientOriginalExtension();
            $filename = $customerID . '_pinkcard.' . $ext;
            $file->move($folderPath, $filename);
            $images->pinkcard_image = $filename;
        }

        $images->save();

        // Delete attachments to delete
        if ($request->filled('attachments_to_delete')) {
            if ($request->filled('attachments_to_delete')) {
                $attachments = $customer->attachments()
                    ->whereIn('id', $request->attachments_to_delete)
                    ->get();

                foreach ($attachments as $attachment) {
                    if ($attachment->file_path) {
                        Storage::disk('s3')->delete($attachment->file_path);
                    }
                    $attachment->delete();
                }
            }
        }

        // Handle new documents upload
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $extension = $file->getClientOriginalExtension();
                $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) 
                            . '_' . $customerID . '.' . $extension;

                $path = $file->storeAs("eps/customer_attachments", $filename, 's3');

                $customer->attachments()->create([
                    'file_name' => $filename,
                    'file_path' => $path,
                ]);
            }
        }

        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }


    public function destroy(Customer $customer)
    {
        
        foreach ($customer->attachments as $attachment) {
            if ($attachment->file_path) {
                Storage::disk('s3')->delete($attachment->file_path);
            }
            $attachment->delete();
        }
        $customer->user()->delete();
        $customer->delete();

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer and all attachments deleted successfully.');
    }


    public function importForm()
    {
        return Inertia::render('Customers/ImportForm', [
            'pageTitle' => 'uploadFromExcel'
        ]);
    }

    public function importFormat()
    {
        return Excel::download(new CustomerImportFormatExport, 'customer-import-template.xlsx');
    }


    public function import(Request $request)
    {
        $request->validate([
           //'file' => 'required|mimes:csv,xlsx,xls|max:2048',
        ]);

        Excel::import(new CustomersImport, $request->file('file'));

        return back()->with('success', 'Customers imported successfully.');
    }

    public function export(Request $request)
    {
        $authUser = auth()->user();

        $query = Customer::with('user');
    
        if ($request->filled('customer_id')) {
            $query->where('customer_id', 'like', '%' . $request->customer_id . '%');
        }
    
        if ($request->filled('name')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->name . '%');
            });
        }
    
        if ($request->filled('phone')) {
            $query->where('phone', 'like', '%' . $request->phone . '%');
        }
    
        $query->where('created_by',$authUser->id);
        $customers = $query->get();
    
        return Excel::download(new CustomersExport($customers), 'customers.csv', ExcelType::CSV);
    }
    

}
