<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class SaveFirebaseTokenRequest extends FormRequest
{
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        return [
            'firebase_token' => 'required|string',
        ];
    }
}
