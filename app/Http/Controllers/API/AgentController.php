<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\AgentListRequest;
use App\Http\Resources\API\AgentListResource;
use App\Http\Resources\API\CategoryListResource;
use App\Http\Resources\API\AgentDetailResource;
use App\Models\Agent;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AgentController extends Controller
{
    protected $nowDate;

    public function __construct() 
    {
        $this->nowDate  = date('Y-m-d H:i:s', time());
    }

    public function getCategoryList(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Login Expired!',
                ], 404);
            }
            
            $agentList = Category::get();

            if ($agentList->isNotEmpty()) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Success',
                    'data'    => CategoryListResource::collection($agentList),
                ]);
            } else {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Data not found!',
                    'data'    => []
                ]);
            }

        } catch (\Exception $e) {
            Log::error($e);
            return response()->json([
                'status'  => 500,
                'message' => 'Something went wrong. Please try again later.',
            ], 500);
        }
    }

    public function getAgentList(AgentListRequest $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Login Expired!',
                ], 404);
            }

            $category_id = $request->category_id;

            $query = Agent::with(['user', 'reviews']);

            if ($category_id) {
                $query->whereHas('user.services', function ($q) use ($category_id) {
                    $q->where('category_id', $category_id);
                });
            }

            $agentList = $query->get();

            if ($agentList->isNotEmpty()) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Success',
                    'data'    => AgentListResource::collection($agentList),
                ]);
            }

            return response()->json([
                'status'  => 200,
                'message' => 'Data not found!',
                'data'    => [],
            ]);

        } catch (\Exception $e) {
            Log::error($e);
            return response()->json([
                'status'  => 500,
                'message' => 'Something went wrong. Please try again later.',
            ], 500);
        }
    }


    public function getAgentDetail(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Login Expired!',
                ], 404);
            }

            $agentId = $request->id;
            
            $agentInfo = Agent::with([
                            'user',
                            'services.category',
                            'services.subcategory',
                            'reviews.customer.user'
                        ])->findOrFail($agentId);


            if ($agentInfo) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Success',
                    'data'    => new AgentDetailResource($agentInfo)
                ]);
            } else {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Data not found!',
                    'data'    => []
                ]);
            }

        } catch (\Exception $e) {
            Log::error($e);
            return response()->json([
                'status'  => 500,
                'message' => 'Something went wrong. Please try again later.',
            ], 500);
        }
    }
    
}
