<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\CustomerReview;
use App\Models\CustomerService;
use App\Models\Customer;
use App\Http\Requests\API\ReviewRequest;

class ReviewController extends Controller
{
    public function saveReview(ReviewRequest $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Login Expired!',
                ], 404);
            }

            DB::beginTransaction();

            // Get customer
            $customer = Customer::where('user_id', $user->id)->first();
            if (!$customer) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Customer not found!',
                ], 404);
            }

            // Get customer service
            $customerService = CustomerService::with('service.user')->findOrFail($request->customer_service_id);

            // Get agent from service
            $agentId = $customerService->service->user->id;

            // Create review
            $review = CustomerReview::create([
                'customer_id' => $customer->id,
                'agent_id' => $agentId,
                'customer_service_id' => $customerService->id,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Review submitted successfully!',
                'data' => $review
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error saving review: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
