<?php

namespace App\Imports;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CustomersImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        Log::info('import customer', $row);

        $dob = $this->formatDate($row['dob'] ?? null);
        $expiredDate = $this->formatDate($row['expired_date'] ?? null);

        $user = User::where('email', $row['email'])->first();

        if ($user) {
            $existingCustomer = Customer::where('user_id', $user->id)->first();
            if ($existingCustomer) {
                Log::info("Customer with email {$row['email']} already exists. Skipping.");
                return null;
            }
        } else {
            $cusId = $row['name'] . "-" . $dob;
            $existingCusId = Customer::where('cus_id', $cusId)->first();
            if ($existingCusId) {
                Log::info("Duplicate cus_id found, generated new cus_id: {$cusId}");
                return null;
            }

            $user = User::create([
                'name' => $row['name'],
                'email' => $row['email'],
                'password' => bcrypt($row['name'] . "-" . $dob),
            ]);
            $user->assignRole('Customer');
            $customerID = generateCustomerID();

            return new Customer([
                'user_id'      => $user->id,
                'customer_id'  => $customerID,
                'cus_id'       => $row['name'] . "-" . $dob,
                'name'         => $row['name'],
                'dob'          => $dob,
                'phone'        => $row['phone'],
                'expired_date' => $expiredDate,
                'address'      => $row['address'],
                'created_by'   => Auth::id(),
            ]);
        }
        return null;
    }


    private function formatDate($value)
    {
        if (!$value) {
            return null;
        }

        $formats = ['m/d/Y', 'd/m/Y', 'Y-m-d'];

        foreach ($formats as $format) {
            try {
                return Carbon::createFromFormat($format, $value)->format('Y-m-d');
            } catch (\Exception $e) {
                continue;
            }
        }

        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            Log::error("Invalid date: {$value}");
            return null;
        }
    }
}
