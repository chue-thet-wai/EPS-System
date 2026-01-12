<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\API\NotificationReadRequest;

class NotificationController extends Controller
{
    public function getNotifications(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    "status"  => 404,
                    "message" => "Login Expired!",
                ], 404);
            }

            $customer = Customer::where("user_id", $user->id)->first();
            if (!$customer) {
                return response()->json([
                    "status"  => 404,
                    "message" => "Customer not found!",
                ], 404);
            }

            $notifications = Notification::where("user_id", $user->id)
                ->where('delivery_status','sent')
                ->orderBy("id", "desc")
                ->get();

            return response()->json([
                "status"  => 200,
                "message" => "Success",
                "data"    => $notifications,
            ]);

        } catch (\Exception $e) {
            Log::error($e);
            return response()->json([
                "status"  => 500,
                "message" => "Something went wrong. Please try again later.",
            ], 500);
        }
    }


    public function markAsRead(NotificationReadRequest $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    "status"  => 404,
                    "message" => "Login Expired!",
                ], 404);
            }

            $notification = Notification::where("id", $request->notification_id)
                ->where("user_id", $user->id)
                ->first();

            if (!$notification) {
                return response()->json([
                    "status"  => 404,
                    "message" => "Notification not found!",
                ], 404);
            }

            $notification->update(["read_status" => "read"]);

            return response()->json([
                "status"  => 200,
                "message" => "Notification marked as read",
            ]);

        } catch (\Exception $e) {
            Log::error($e);
            return response()->json([
                "status"  => 500,
                "message" => "Something went wrong. Please try again later.",
            ], 500);
        }
    }
}
