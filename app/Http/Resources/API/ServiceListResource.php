<?php

namespace App\Http\Resources\API;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceListResource extends JsonResource
{
    public function toArray($request)
    {
        
        return [
            'id'            => $this->id,
            'category_id'   => $this->category_id,
            'agent_id'      => $this->agent_id,
            'title'         => $this->title,
            'description'   => $this->description,
            'remark'        => $this->remark,
            'updated_at'    => $this->updated_at,
            'created_at'    => $this->created_at,
        ];
    }
}
