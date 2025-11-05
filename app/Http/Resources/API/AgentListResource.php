<?php  

namespace App\Http\Resources\API;  

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class AgentListResource extends JsonResource 
{  

    public function toArray($request)  
    {  
        $user = Auth::user();

        $avgRating = $this->reviews->avg('rating');
        $avgRating = $avgRating ? number_format($avgRating, 1) : 0;

        $canRequest = true;

        if ($user && $user->customer) {
            $hasPendingService = $user->customer->services()
                ->whereHas('service', function($query) {
                    $query->where('created_by', $this->id); 
                })
                ->whereNotIn('status', [4, 9])
                ->exists();

            if ($hasPendingService) {
                $canRequest = false;
            }
        }


        return [  
            'id'         => $this->id,  
            'name'       => $this->user->name,  
            'rating'     => $avgRating,  
            'location'   => $this->location,  
            'canRequest' => $canRequest,  
            'updated_at' => $this->updated_at,  
            'created_at' => $this->created_at,  
        ];  
    }  
}
