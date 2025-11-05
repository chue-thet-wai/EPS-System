<?php
namespace App\Http\Requests\API;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class ForgotPasswordRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'type' => ['required', 'string', Rule::in(['phone', 'email'])],
            'value' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    if ($this->type === 'phone' && !preg_match('/^\+?[0-9]+$/', $value)) {
                        $fail('The ' . $attribute . ' must be a valid phone number.');
                    }
                    if ($this->type === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $fail('The ' . $attribute . ' must be a valid email address.');
                    }
                },
            ],
        ];
    }
}
