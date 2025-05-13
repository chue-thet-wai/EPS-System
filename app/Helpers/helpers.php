<?php

use App\Models\Customer;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

function checkUserRole($roleName, $user = null)
{
    $user = $user ?? Auth::user();
    if (!$user) {
        return false;
    }
    $roleId = Role::where('name', $roleName)->pluck('id')->first();
    return $user->roles()->where('id', $roleId)->exists();
}

function generateCustomerID() 
{
    $characters = '1234567890';
    $length = 9;

    do {
        $randomNumber = '';
        for ($i = 0; $i < $length; $i++) {
            $randomNumber .= $characters[rand(0, strlen($characters) - 1)];
        }

        $customerID = 'C-' . $randomNumber;
        $exists = Customer::where('customer_id', $customerID)->exists();

    } while ($exists);

    return $customerID;
}

