<?php

namespace App\Http\Controllers;

use App\Exports\CustomersExport;
use App\Imports\CustomersImport;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelType;

class CustomerController extends Controller
{
    public function index(Request $request)
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

        $customers = $query->paginate(config('common.paginate_per_page'))->appends($request->all());

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['name', 'email', 'phone']),
        ]);
    }


    public function create()
    {
        return Inertia::render('Customers/Form', [
            'statuses' => config('common.statuses'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'dob' => 'nullable|date',
            'expired_date' => 'nullable|date',
            'address' => 'string',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->name."-".$request->dob),
        ]);

        // Assign role if using spatie roles
        $user->assignRole('Customer');

        // Create customer linked to user
        $customerID = generateCustomerID();
        $user->customer()->create([
            'customer_id' => $customerID,
            'cus_id'      => $request->name."-".$request->dob,
            'phone'       => $request->phone,
            'dob'         => $request->dob,
            'expired_date'=> $request->expired_date,
            'address'     => $request->address,
            'created_by'  => Auth::id(),
        ]);

        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Form', [
            'customer' => $customer->load('user'),
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $customer->user_id,
            'phone' => 'required|string|max:20',
            'dob' => 'nullable|date',
            'expired_date' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        // Update user
        $customer->user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Update customer
        $customer->update([
            'cus_id'      => $request->name."-".$request->dob,
            'phone'       => $request->phone,
            'dob'         => $request->dob,
            'expired_date'=> $request->expired_date,
            'address' => $request->address,
            'updated_by' => Auth::id(),
        ]);

        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->user()->delete();
        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
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
