<?php

namespace App\Http\Resources\API;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerServiceDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'           => $this->id,
            'service_name' => $this->service->title ?? null, 
            'service_cost' => $this->service->cost ?? null, 
            'agent_name'   => $this->service->user->name ?? null, 
            'note'         => $this->note,
            'status'       => $this->status,
            'histories'    => $this->histories->map(function ($history) {
                return [
                    'id'         => $history->id,
                    'status'     => $history->status,
                    'note'       => $history->note ?? '',
                    'changed_by' => [
                        'id'    => $history->changer->id ?? null,
                        'name'  => $history->changer->name ?? null
                    ],
                    'created_at' => $history->created_at,
                ];
            }),
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}
