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

class SettingController extends Controller
{
    protected $nowDate;

    public function __construct() 
    {
        $this->nowDate  = date('Y-m-d H:i:s', time());
    }

    public function faqs(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Login Expired!',
                ], 404);
            }

            $faqs = config('faqs.text'); 

            return response()->json([
                'status'  => 200,
                'message' => 'Success',
                'data'    => $faqs,
            ]);

        } catch (\Exception $e) {
            Log::error($e);
            return response()->json([
                'status'  => 500,
                'message' => 'Something went wrong. Please try again later.',
            ], 500);
        }
    }

    public function terms(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Login Expired!',
                ], 404);
            }

            $terms = config('terms.text');

            return response()->json([
                'status'  => 200,
                'message' => 'Success',
                'data'    => $terms,
            ]);

        } catch (\Exception $e) {
            Log::error($e);
            return response()->json([
                'status'  => 500,
                'message' => 'Something went wrong. Please try again later.',
            ], 500);
        }
    }

    
}
