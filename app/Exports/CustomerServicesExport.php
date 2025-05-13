<?php

namespace App\Exports;

use App\Models\Customer;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Http\Request;

class CustomerServicesExport implements FromView
{
    protected $customerServices;

    public function __construct($customerServices)
    {
        $this->customerServices = $customerServices;
    }

    public function view(): View
    {
        return view('exports.customer-services', [
            'customerServices' => $this->customerServices
        ]);
    }
}
