<?php

namespace App\Http\Requests\API;

use App\Http\Requests\BaseRequest;
use App\Models\User;

class RegisterRequest extends BaseRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'dob' => ['required', 'date'], 
            'phone' => ['nullable', 'string'], 
            'nationality'  => ['nullable', 'string'],
            'gender' => ['required', 'string', 'in:Male,Female,Other'],
            'email' => [
                'required',
                'string',
                'email', 
                'max:255',
                function ($attribute, $value, $fail) {
                    if (User::where('email', $value)->exists()) {
                        $fail('The email has already been taken.');
                    }
                },
            ],
            'address'      =>['nullable'],
            'password' => ['required', 'string', 'min:8', 'max:255'],
            'password_confirmation' => ['required', 'string', 'same:password'],
        ];
    }
}
