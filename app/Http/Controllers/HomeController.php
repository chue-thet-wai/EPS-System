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
        $todayExpireCustomers = [];

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
            $stats['pendingCustomers'] = CustomerService::whereHas('service', function ($query) use ($user) {
                $query->where('agent_id', $user->id);
            })->where('status', '1')->count();

            $stats['progressCustomers'] = CustomerService::whereHas('service', function ($query) use ($user) {
                $query->where('agent_id', $user->id);
            })->where('status', '2')->count();

            $stats['completedCustomers'] = CustomerService::whereHas('service', function ($query) use ($user) {
                $query->where('agent_id', $user->id);
            })->where('status', '3')->count();

            // Today's expiring customer services
            $todayExpireCustomers = CustomerService::whereHas('service', function ($query) use ($user) {
                    $query->where('agent_id', $user->id);
                })
                ->whereDate('end_date', Carbon::today())
                ->with(['customer.user', 'service'])
                ->get();
            
        }

        return Inertia::render('Dashboard', [
            'user' => $user,
            'role' => $role,
            'stats' => $stats,
            'todayExpireCustomers' => $todayExpireCustomers,
        ]);
    }
}
