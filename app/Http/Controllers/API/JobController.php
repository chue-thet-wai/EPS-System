<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\UploadCVRequest;
use App\Http\Resources\API\JobDetailResource;
use App\Http\Resources\API\JobListResource;
use App\Models\Customer;
use App\Models\Job;
use App\Models\Applicant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JobController extends Controller
{
    protected $nowDate;

    public function __construct() 
    {
        $this->nowDate  = date('Y-m-d H:i:s', time());
    }

    public function jobList(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Login Expired!',
                ], 404);
            }

            $customer = Customer::where('user_id', $user->id)->first();
            if (!$customer) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Customer not found!',
                ], 404);
            }
            
            $jobList = Job::get();

            if ($jobList->isNotEmpty()) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Success',
                    'data'    => JobListResource::collection($jobList),
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

    public function jobDetail(Request $request)
    {
        try {
            $user = Auth::user();
            $job_id = $request->id;
            
            $jobDetail = Job::findOrFail($job_id);


            if ($jobDetail) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Success',
                    'data'    => new JobDetailResource($jobDetail)
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

    public function uploadCV(UploadCVRequest $request)
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

            $customer = Customer::where('user_id', $user->id)->first();
            if (!$customer) {
                return response()->json([
                    'status'  => 404,
                    'message' => 'Customer not found!',
                ], 404);
            }

            $cvPath = null;
            if ($request->hasFile('cv')) {
                $file = $request->file('cv');
                $extension = $file->getClientOriginalExtension();
                $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) 
                            . '_' . $customer->id . '.' . $extension;

                $cvPath = $file->storeAs("eps/customer_cv", $filename, 's3');
            }

            $applicant = Applicant::create([
                'customer_id' => $customer->id,
                'cv_path'     => $cvPath,
                'created_by'  => $user->id,
            ]);

            DB::commit();

            return response()->json([
                'status'  => 200,
                'message' => 'CV uploaded successfully!',
                'data'    => $applicant
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);

            return response()->json([
                'status'  => 500,
                'message' => 'Something went wrong. Please try again later.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }


    
}
