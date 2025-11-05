<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Customer;
use App\Models\CustomerService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return $this->dashboard(); 
    }

    public function dashboard()
    {
        $user = Auth::user();
        $role = $user->roles->pluck('name')->first();
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();

        $stats = [];

        $searchId = request()->query('searchId');

        if ($role === 'Admin') {
            $stats['totalAgentCount'] = User::whereHas("roles", fn($q) => $q->where("name", "Agent"))->count();
            $stats['agentCountThisMonth'] = User::whereHas("roles", fn($q) => $q->where("name", "Agent"))
                ->where('created_at', '>=', $startOfMonth)
                ->count();

            $stats['totalCustomerCount'] = User::whereHas("roles", fn($q) => $q->where("name", "Customer"))->count();
            $stats['customerCountThisMonth'] = User::whereHas("roles", fn($q) => $q->where("name", "Customer"))
                ->where('created_at', '>=', $startOfMonth)
                ->count();
        }

        if ($role === 'Agent') {
            $stats['totalCustomers'] = Customer::where('created_by', $user->id)->count();

            $stats['expiringThisMonth'] = Customer::where('created_by', $user->id)
                ->where(function ($query) use ($now) {
                    $query->whereMonth('passport_expiry', $now->month)
                        ->orWhereMonth('visa_expiry', $now->month)
                        ->orWhereMonth('ci_expiry', $now->month)
                        ->orWhereMonth('pink_card_expiry', $now->month);
                })
                ->count();

            $stats['newCustomersThisMonth'] = Customer::where('created_by', $user->id)
                ->where('created_at', '>=', $startOfMonth)
                ->count();

            $stats['activeServices'] = CustomerService::whereHas('customer', function ($query) use ($user) {
                $query->where('created_by', $user->id);
            })->count();

            if ($searchId) {
                $stats['customerTableData'] = Customer::where('created_by', $user->id)
                    ->where('customer_id', $searchId)
                    ->paginate(config('common.paginate_per_page'));
            } else {
                $stats['customerTableData'] = Customer::where('created_by', $user->id)
                    ->whereRaw('0 = 1') 
                    ->paginate(config('common.paginate_per_page'));
            }
        }

        return Inertia::render('Dashboard', [
            'user' => $user,
            'role' => $role,
            'stats' => $stats,
            'searchId' => $searchId, 
            'pageTitle' => 'dashboard',
        ]);
    }


}
