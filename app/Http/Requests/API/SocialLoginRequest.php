<?php
namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class SocialLoginRequest extends FormRequest
{
   
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'provider'    => ['required', 'string'],
            'provider_id' => ['required', 'string'],
            'email'       => ['required', 'email'],
            'name'        => ['required', 'string', 'max:255']
        ];
    }
}
