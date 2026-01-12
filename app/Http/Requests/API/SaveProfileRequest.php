<?php

namespace App\Http\Requests\API;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class SaveProfileRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // User table
            'name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email:rfc,dns',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->user()->id),
            ],
            'sex'              => ['required', 'string', 'in:Male,Female,Other'],
            'dob'              => ['required', 'date'],
            'phone'            => ['nullable', 'string', 'max:50'],
            'phone_secondary'  => ['nullable', 'string', 'max:50'],
            'address'          => ['nullable', 'string', 'max:500'],
            'nrc_no'           => ['nullable', 'string', 'max:50'],
            'prev_passport_no' => ['nullable', 'string', 'max:50'],
            'passport_no'      => ['nullable', 'string', 'max:50'],
            'passport_expiry'  => ['nullable', 'date'],
            'visa_type'        => ['nullable', 'string', 'max:100'],
            'visa_number'      => ['nullable', 'string', 'max:50'],
            'visa_expiry'      => ['nullable', 'date'],
            'ci_no'            => ['nullable', 'string', 'max:50'],
            'ci_expiry'        => ['nullable', 'date'],
            'pink_card_no'     => ['nullable', 'string', 'max:50'],
            'pink_card_expiry' => ['nullable', 'date'],

        ];
    }
}
