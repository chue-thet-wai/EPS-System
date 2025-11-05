<?php

namespace App\Http\Resources\API;

use Illuminate\Http\Resources\Json\JsonResource;

class AgentDetailResource extends JsonResource
{
    public function toArray($request)
    {
        $avgRating = $this->reviews->avg('rating');
        $avgRating = $avgRating ? number_format($avgRating, 1) : 0;

        return [
            'id'       => $this->id,
            //'agent_id' => $this->agent_id,
            'rating'   => $avgRating,  
            'name'     => $this->user->name,
            'email'    => $this->user->email,
            'biz_name' => $this->biz_name,
            'phone'    => $this->phone,
            'location' => $this->location,
            'services'  => $this->services->map(function ($service) {
                return [
                    'id'          => $service->id,
                    'title'       => $service->title ?? '',
                    'category'    => $service->category->name ?? '',
                    'subcategory' => $service->subcategory->name ?? '',
                    'detail'      => $service->detail ?? '',
                    'duration'    => $service->duration ?? '',
                    'cost'        => $service->cost ?? '',
                    'created_at'  => $service->created_at,
                ];
            }),
            'reviews' => $this->reviews->map(function($review) {
                return [
                    'id'           => $review->id,
                    'rating'       => $review->rating,
                    'comment'      => $review->comment,
                    'customer_name'=> $review->customer->user->name ?? null,
                    'customer_email'=> $review->customer->user->email ?? null,
                    'created_at'   => $review->created_at,
                ];
            }),
        ];
    }
}
