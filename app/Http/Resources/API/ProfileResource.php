<?php

namespace App\Http\Resources\API;

use Illuminate\Support\Facades\Auth;
use App\Http\Resources\API\ProfileMoreDetailsResource;
use App\Interfaces\CountryCityRepositoryInterface;
use App\Models\Question;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class ProfileResource extends JsonResource
{

    public function __construct($resource) 
    {
        parent::__construct($resource); 
    }
    
    public function toArray($request)
    {
        $data = [
            'id'              => $this->id,
            'customer_id'     => $this->customer_id,
            'cus_id'          => $this->cus_id,
            'firebase_token'  => $this->user->firebase_token,
            'user_id'         => $this->user->id,
            'name'            => $this->user->name,
            'name_mm'         => $this->name_mm,
            'sex'             => $this->sex?? null,
            'dob'             => $this->dob,
            'nrc_no'          => $this->nrc_no?? null,
            'prev_passport_no'=> $this->prev_passport_no ?? null,
            'passport_no'     => $this->passport_no ?? null,
            'passport_expiry' => $this->passport_expiry ?? null,
            'visa_type'       => $this->visa_type ?? null,
            'visa_number'     => $this->visa_number ?? null,
            'visa_expiry'     => $this->visa_expiry ?? null,
            'ci_no'           => $this->ci_no ?? null,
            'ci_expiry'       => $this->ci_expiry ?? null,
            'pink_card_no'    => $this->pink_card_no ?? null,
            'pink_card_expiry'=> $this->pink_card_expiry ?? null,
            'email'           => $this->user->email,
            'phone'           => $this->phone?? null,
            'phone_secondary' => $this->phone_secondary?? null,
            'address'         => $this->address ?? null,
        ];

        return $data;
    }
}
