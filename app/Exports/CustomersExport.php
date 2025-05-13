<?php

namespace App\Exports;

use App\Models\Customer;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Http\Request;

class CustomersExport implements FromView
{
    protected $customers;

    public function __construct($customers)
    {
        $this->customers = $customers;
    }

    public function view(): View
    {
        return view('exports.customers', [
            'customers' => $this->customers
        ]);
    }
}
