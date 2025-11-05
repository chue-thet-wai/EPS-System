<?php

namespace App\Http\Requests\API;

use App\Http\Requests\BaseRequest;
use App\Models\User;

class UploadCVRequest extends BaseRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cv' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ];
    }
}
