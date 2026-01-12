<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class AgentListRequest extends FormRequest
{
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        return [
            'category_id' => 'nullable|integer|exists:categories,id',
        ];
    }
}
