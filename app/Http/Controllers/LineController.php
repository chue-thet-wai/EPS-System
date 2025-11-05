<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LineController extends Controller
{

    public function handleWebhook(Request $request)
    {
        $event = $request->events[0];
        $lineUserId = $event['source']['userId'];
        $messageText = trim($event['message']['text'] ?? '');

        $checkLineReg = Customer::where('line_user_id', $lineUserId)->first();

        if ($event['type'] === 'message' && !$checkLineReg && !Str::startsWith($messageText, 'C-')) {
            $this->sendMessage($lineUserId, "Hi! Please send your Customer ID (e.g. `C-xxxxxxxxx`) to link your account.");
        }

        if ($event['type'] === 'message' && Str::startsWith($messageText, 'C-')) {
            $customer = Customer::where('customer_id', $messageText)->first();

            if ($customer) {
                // Check if this LINE user is already linked to another customer
                if ($customer->line_user_id && $customer->line_user_id !== $lineUserId) {
                    $this->sendMessage($lineUserId, "This Customer ID is already linked to another LINE account.");
                    return;
                }

                $customer->update(['line_user_id' => $lineUserId]);
                $this->sendMessage($lineUserId, "Your LINE account has been linked to Customer ID: {$messageText}.");
            } else {
                $this->sendMessage($lineUserId, "No customer found with ID {$messageText}. Please try again.");
            }
        }
    }

    public function sendLineMessage(Request $request) {
        $request->validate([
            'line_user_id' => 'required|string',
            'url' => 'required|url',
        ]);

        $lineUserId = $request->line_user_id;
        $serviceUrl = $request->url;

        $this->sendMessage($lineUserId,$serviceUrl);
    }

    public function sendMessage($userId, $message)
    {
        $accessToken = "OAHgfRDJX9qsD9ke2XELJLLuuUJ9s6VwhpdQ6JtM3On4lbDSwhIJ7tZKYnkBD7qF99aOD5YF7iJijjcEpeuMov9Ym6C9treqIS5HuPNpRl8GFWxPz0LnpQLnqqRWE7mDtQ0QoSVNIGvTFS8pZ/1d8wdB04t89/1O/w1cDnyilFU="; 
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
            'Content-Type' => 'application/json',
        ])->post("https://api.line.me/v2/bot/message/push", [
            'to' => $userId,
            'messages' => [
                [
                    'type' => 'text',
                    'text' => $message,
                ],
            ],
        ]);

        if ($response->successful()) {
            return response()->json(['status' => 'Message sent successfully']);
        }

        return response()->json(['status' => 'Failed to send message', 'response' => $response->body()]);
    }


}
