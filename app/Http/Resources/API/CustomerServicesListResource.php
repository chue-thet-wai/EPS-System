<?php

namespace App\Http\Resources\API;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerServicesListResource extends JsonResource
{
    public function toArray($request)
    {
       
        return [
            'id'            => $this->id,
            'service_name'  => $this->service->title ?? null, 
            'service_cost'  => $this->service->cost ?? null, 
            'agent_name'    => $this->service->user->name ?? null, 
            'note'          => $this->note,
            'status'        => $this->status,
            'updated_at'    => $this->updated_at,
            'created_at'    => $this->created_at
        ];
    }
}
