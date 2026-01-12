<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class RequestServiceRequest extends FormRequest
{
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        return [
            'service_id' => 'required|exists:services,id',
            'note'       => 'nullable|string|max:500',

            'name'         => 'required|string|max:255',
            'dob'          => 'required|date',
            'nationality'  => 'required|string|max:100',
            'gender'       => 'required|string',
            'type'         => 'required|string',
            'number'       => 'required|string',
            'expiry_date'  => 'required|date',

            // Documents array validation
            'documents'   => 'nullable|array',
            'documents.*.type' => 'required_with:documents.*.file|string|max:100',
            'documents.*.file' => 'required_with:documents.*.type|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'service_id.required' => 'Service is required.',
            'service_id.exists'   => 'Selected service is invalid.',

            'name.required'        => 'Name is required.',
            'dob.required'         => 'Date of birth is required.',
            'nationality.required' => 'Nationality is required.',
            'gender.required'      => 'Gender is required.',
            'number.required'      => 'Number is required.',
            'expiry_date.required' => 'Expiry date is required.',

            'documents.*.type.required_with' => 'Each document must have a type.',
            'documents.*.file.required_with' => 'Each document type must have a file.',
            'documents.*.file.mimes' => 'Only JPG, PNG, and PDF files are allowed.',
        ];
    }
}
