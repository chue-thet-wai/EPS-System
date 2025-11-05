<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\RequestServiceRequest;
use App\Http\Resources\API\CustomerServiceDetailResource;
use App\Http\Resources\API\CustomerServicesListResource;
use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\CustomerServiceHistory;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    protected $nowDate;

    public function __construct() 
    {
        $this->nowDate  = date('Y-m-d H:i:s', time());
    }

    public function customerServicesList(Request $request)
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
            
            $customerServicesList = CustomerService::with(['service.user'])
                            ->where('customer_id', $customer->id)
                            ->get();

            if ($customerServicesList->isNotEmpty()) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Success',
                    'data'    => CustomerServicesListResource::collection($customerServicesList),
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

    public function customerServiceDetail(Request $request)
    {
        try {
            $user = Auth::user();
            $customer_service_id = $request->id;
            
            $customerServiceDetail = CustomerService::with(['service.user', 'histories'])
                                ->findOrFail($customer_service_id);


            if ($customerServiceDetail) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Success',
                    'statuses'=> config('common.service_statuses'),
                    'data'    => new CustomerServiceDetailResource($customerServiceDetail)
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

    public function requestService(RequestServiceRequest $request)
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

            //update customer data
            $service = Service::with(['category', 'subcategory'])->find($request->service_id);

            $isPassport = $isVisa = $isCI = $isPinkCard = false;

            if ($service && $service->category) {
                $categoryName = strtolower($service->category->name);
                $isPassport   = $categoryName === 'passport';
                $isVisa       = $categoryName === 'visa';
                $isCI         = $categoryName === 'ci';
                $isPinkCard   = $categoryName === 'pink_card';
            }

            $updateData = [
                'cus_id'      => $request->name . "-" . $request->dob,
                'dob'         => $request->dob,
                'sex'         => $request->gender,
                'nationality' => $request->nationality,
            ];

            if ($isPassport) {
                $updateData['passport_no']     = $request->number;
                $updateData['passport_expiry'] = $request->expiry_date;
            } elseif ($isVisa) {
                $updateData['visa_no']     = $request->number;
                $updateData['visa_expiry'] = $request->expiry_date;
            } elseif ($isCI) {
                $updateData['ci_no']     = $request->number;
                $updateData['ci_expiry'] = $request->expiry_date;
            } elseif ($isPinkCard) {
                $updateData['pink_card_no']     = $request->number;
                $updateData['pink_card_expiry'] = $request->expiry_date;
            }

            $customer->update($updateData);

            if ($customer->user) {
                $customer->user->update([
                    'name' => $request->name
                ]);
            }


            // Create service request
            $customerService = CustomerService::create([
                'customer_id' => $customer->id,
                'service_id'  => $request->service_id,
                'status'      => 1,
                'note'        => $request->note,
                'created_by'  => $user->id,
            ]);

            //save history
            CustomerServiceHistory::create([
                'customer_service_id' => $customerService->id,
                'status' => 1,
                'note' => $request->note ?? null,
                'changed_by' => Auth::id(),
            ]);

            if ($request->has('documents')) {
                foreach ($request->documents as $index => $doc) {
                    if (!isset($doc['file']) || !$doc['file'] instanceof \Illuminate\Http\UploadedFile) {
                        continue; 
                    }

                    $file = $doc['file'];
                    $docType = $doc['type'] ?? 'document';
                    $extension = $file->getClientOriginalExtension();
                    $filename = $docType . '_' . $customer->id . '_' . time() . '_' . $index . '.' . $extension;

                    $path = $file->storeAs('eps/customer_attachments', $filename, 's3');

                    $customer->attachments()->create([
                        'customer_id' => $customer->id,
                        'file_name'    => $filename,
                        'file_path'    => $path
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status'  => 200,
                'message' => 'Service request submitted successfully!',
                'data'    => $customerService
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error($e);

            return response()->json([
                'status'  => 500,
                'message' => 'Something went wrong. Please try again later.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    
}
