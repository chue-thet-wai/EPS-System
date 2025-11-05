<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerServiceHistory extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function customerService()
    {
        return $this->belongsTo(CustomerService::class);
    }

}
