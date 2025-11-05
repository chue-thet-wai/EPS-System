<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\SaveProfileRequest;
use App\Http\Resources\API\ProfileResource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    protected $nowDate;

    public function __construct() 
    {
        $this->nowDate  = date('Y-m-d H:i:s', time());
    }

    public function saveProfile(SaveProfileRequest $request)
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

            $customer = Customer::with('user')->where('user_id', $user->id)->first();

            if (!$customer) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Customer not found!',
                ], 404);
            }

            // Update user table
            $user->update([
                'name'  => $request->name,
                'email' => $request->email,
            ]);

            // Update customer table
            $customer->update([
                'cus_id'           => $request->name . "-" . $request->dob,
                'phone'            => $request->phone,
                'phone_secondary'  => $request->phone_secondary,
                'dob'              => $request->dob,
                'nrc_no'           => $request->nrc_no,
                'prev_passport_no' => $request->prev_passport_no,
                'passport_no'      => $request->passport_no,
                'passport_expiry'  => $request->passport_expiry,
                'visa_type'        => $request->visa_type,
                'visa_number'      => $request->visa_number,
                'visa_expiry'      => $request->visa_expiry,
                'ci_no'            => $request->ci_no,
                'ci_expiry'        => $request->ci_expiry,
                'pink_card_no'     => $request->pink_card_no,
                'pink_card_expiry' => $request->pink_card_expiry,
                'address'          => $request->address,
                'updated_by'       => $user->id,
            ]);

            DB::commit();

            return response()->json([
                'status'  => 200,
                'message' => 'Profile Updated Successfully!',
            ]);

        } catch (Exception $e) {
            DB::rollback();
            Log::error($e);

            return response()->json([
                'status'  => 500,
                'message' => 'Something went wrong. Please try again later.',
            ], 500);
        }
    }

    

    public function getProfile(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Login Expired!',
                ], 404);
            }
            $userId = $user->id;
            
            $customer = Customer::with('user')->where('user_id',$userId)->first();

            if ($customer) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Success',
                    'data'    => new ProfileResource($customer)
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
