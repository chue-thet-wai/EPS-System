<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\ChangePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AccountController extends Controller
{
    protected $nowDate;

    public function __construct() 
    {
        $this->nowDate  = date('Y-m-d H:i:s', time());
    }


    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            $user = Auth::user();
    
            DB::beginTransaction();
    
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status'  => 403,
                    'message' => 'Current password does not match!',
                ], 403);
            }

            $userData = [
                'password'  => Hash::make($request->new_password)
            ];
            $userUpdate = User::where('id',$user->id)->update($userData);
    
            DB::commit();
    
            return response()->json([
                'status'  => 200,
                'message' => 'Password changed successfully!',
            ]);
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error changing password: ' . $e->getMessage());
    
            return response()->json([
                'status'  => 500,
                'message' => 'Something went wrong. Please try again later.',
            ], 500);
        }
    }

}
