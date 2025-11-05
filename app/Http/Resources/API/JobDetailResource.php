<?php

namespace App\Http\Resources\API;

use Illuminate\Http\Resources\Json\JsonResource;

class JobDetailResource extends JsonResource
{
    public function toArray($request)
    {
       
        $jobTypes = collect(config('common.job_types'));
        $typeLabel = $jobTypes->firstWhere('value', $this->type)['label'] ?? $this->type;

        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'location'    => $this->location,
            'type'        => $typeLabel,  
            'salary'      => $this->salary,
            'updated_at'  => $this->updated_at,
            'created_at'  => $this->created_at,
        ];
    }
}
