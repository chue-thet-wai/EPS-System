<?php

namespace App\Services;

use App\Models\User;
use App\Models\Notification;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FcmNotification;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected $messaging;

    public function __construct()
    {
        $this->messaging = app('firebase.messaging');
    }

    public function sendToUserByToken($token, $title, $body)
    {
        $user = User::where('firebase_token', $token)->first();
        Log::info($user);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Firebase token not found'
            ];
        }

        // Create notification
        $notification = Notification::create([
            'user_id'          => $user->id,
            'title'            => $title,
            'body'             => $body,
            'delivery_status'  => 'pending',  
            'read_status'      => 'unread',  
        ]);

        try {
            //Log::info('Sending FCM...');
            $message = CloudMessage::new()
                ->toToken($token)  
                ->withNotification(FcmNotification::create($title, $body))
                ->withData([
                    'notification_id' => (string) $notification->id
                ]);

            //Log::info('Before send...');
            $response = $this->messaging->send($message);
            //Log::info("After send");
            //Log::info($response);

            // Update as sent
            $notification->update([
                'delivery_status' => 'sent'
            ]);

            return [
                'success' => true,
                'notification' => $notification,
                'fcm_response' => $response
            ];

        } catch (\Exception $e) {

            //Log::error('FCM Error: '.$e->getMessage());
            //Log::error($e->getTraceAsString());

            // Update as failed
            $notification->update([
                'delivery_status' => 'failed'
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
}
