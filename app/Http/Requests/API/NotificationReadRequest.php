<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class NotificationReadRequest extends FormRequest
{
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        return [
            'notification_id' => 'required|integer|exists:notifications,id',
        ];
    }
}
