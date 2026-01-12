<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\LoginRequest;
use App\Http\Requests\API\RegisterRequest;
use App\Http\Requests\API\SocialLoginRequest;
use App\Http\Resources\API\ProfileResource;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\UserProvider;
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

                $customer = Customer::with('user')->where('user_id',$userId)->first();

                return response()->json([
                    'status'  => 200,
                    'message' => 'Successfully authenticated!',
                    'token'   => $token,
                    'data'    => $customer ? new ProfileResource($customer) : [],
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

    public function socialLogin(SocialLoginRequest $request)
    {
        DB::beginTransaction();

        try {

            // Find the user by email
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                // Create a new user
                $user = User::create([
                    'name'     => $request->name,
                    'email'    => $request->email,
                ]);

                //Assign customer role
                $user->assignRole('Customer');

                //create customer
                $customerID = generateCustomerID();
                $user->customer()->create([
                    'customer_id' => $customerID,
                    'cus_id'      => $request->provider_id ,
                    'created_by'  => $user->id,
                ]);

                $token = $user->createToken('auth_token')->plainTextToken;
            } 

            // Update or create the provider record
            UserProvider::updateOrCreate(
                [
                    'provider' => $request->provider,
                    'provider_id' => $request->provider_id,
                ],
                ['user_id' => $user->id]
            );

            // Commit the transaction
            DB::commit();

            // Create a new token for the user
            $token = $user->createToken('auth_token')->plainTextToken;

            $userId = $user->id;
            $customer = Customer::with('user')->where('user_id',$userId)->first();

            return response()->json([
                'status' => 200,
                'message' => 'Successfully authenticated!',
                'token' => $token,
                'data'    => $customer ? new ProfileResource($customer) : [],
            ]);
        } catch (Exception $e) {
            // Rollback the transaction on error
            DB::rollback();
            return $this->handleException($e);
        }
    }

    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();

        try {
            $emailName = explode('@', $request->email)[0];             
            $formattedName = ucwords(str_replace(['.', '_'], ' ', $emailName));

            $user = User::create([
                'name'     => $formattedName,
                'email'    => $request->email,
                'password' => $request->password,
            ]);

            $user->assignRole('Customer');

            $customerID = generateCustomerID();
            $user->customer()->create([
                'customer_id' => $customerID,
                'cus_id'      => $formattedName . "-" . $request->dob,
                'phone'       => $request->phone,
                'dob'         => $request->dob,
                'nationality' => $request->nationality,
                'sex'         => $request->gender,
                'address'     => $request->address,
                'created_by'  => $user->id,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;
            DB::commit();
            
            $userId = $user->id;
            $customer = Customer::with('user')->where('user_id',$userId)->first();
            return response()->json([
                'status'  => 200,
                'message' => 'User registered successfully!',
                'token'   => $token,
                'data'    => $customer ? new ProfileResource($customer) : [],
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
