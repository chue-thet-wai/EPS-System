<?php

namespace App\Http\Resources\API;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerServiceDetailResource extends JsonResource
{
    public function toArray($request)
    {
        $statuses = config('common.service_statuses');

        // Map status to a simplified status code
        if (in_array($this->status, [1, 2, 3, 4])) {
            $status = 0;
        } elseif ($this->status == 5) {
            $status = 1;
        } elseif (in_array($this->status, [6, 7, 8])) {
            $status = 2;
        } elseif ($this->status == 9) {
            $status = 3;
        } else {
            $status = null; // default if status not matched
        }

        return [
            'id'           => $this->id,
            'service_name' => $this->service->title ?? null, 
            'service_cost' => $this->service->cost ?? null, 
            'agent_name'   => $this->service->user->name ?? null, 
            'note'         => $this->note,
            'status'       => $status,
            'histories'    => $this->histories->map(function ($history) {
                return [
                    'id'         => $history->id,
                    'status'     => $history->status,
                    'note'       => $history->note ?? '',
                    'changed_by' => [
                        'id'   => $history->changer->id ?? null,
                        'name' => $history->changer->name ?? null,
                    ],
                    'created_at' => $history->created_at,
                ];
            }),
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}
