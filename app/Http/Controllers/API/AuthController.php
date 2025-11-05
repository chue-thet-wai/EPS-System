<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\LoginRequest;
use App\Http\Requests\API\RegisterRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected $nowDate;

    public function __construct() 
    {
        $this->nowDate  = date('Y-m-d H:i:s', time());
    }
    
    public function login(LoginRequest $request)
    {
        try {
    
            $email = $request->email;
            $password = $request->password;

            $userData = User::where('email', $email)->first();

            if ($userData && Hash::check($password, $userData->password)) {
                $userId = $userData->id;
                $token = $userData->createToken('auth_token')->plainTextToken;
                return response()->json([
                    'status'  => 200,
                    'message' => 'Successfully authenticated!',
                    'token'   => $token,
                ]);
            } else {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Invalid credentials',
                ], 404);
            }

        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();

        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => $request->password,
            ]);

            // Assign role if using spatie roles
            $user->assignRole('Customer');

            // Create customer linked to user
            $customerID = generateCustomerID();
            $user->customer()->create([
                'customer_id' => $customerID,
                'cus_id'      => $request->name."-".$request->dob,
                'phone'       => $request->phone,
                'dob'         => $request->dob,
                'nationality' => $request->nationality,
                'sex'         => $request->gender,
                'address'     => $request->address,
                'created_by'  => $user->id,
            ]);
           

            $token = $user->createToken('auth_token')->plainTextToken;
            DB::commit();

            return response()->json([
                'status'  => 200,
                'message' => 'User registered successfully!',
                'token'   => $token,
            ]);
        } catch (Exception $e) {
            DB::rollback();
            return $this->handleException($e);
        }
    }
    

    private function handleException(Exception $e)
    {
        Log::error($e);
        return response()->json(['status' => 500, 'message' => 'Something went wrong. Please try again later.'], 500);
    }
}
