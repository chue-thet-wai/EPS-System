<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AgentController extends Controller
{
 
    public function index()
    {
        $agents = Agent::with('user')->paginate(config('common.paginate_per_page'));
    
        return Inertia::render('Agents/Index', [
            'agents'     => $agents,
            'pageTitle' => 'agents'
        ]);
    }


    public function create()
    {
        return Inertia::render('Agents/Form',[
            'pageTitle' => 'createAgent'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'biz_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string',
           
        ]);

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'created_by' => auth()->id(),
        ]);

        $user->assignRole('Agent');

        // Generate customer ID
        $agentID = generateAgentID();

        // Create customer record
        $user->agent()->create([
            'agent_id'           => $agentID,
            'phone'              => $request->phone,
            'biz_name'           => $request->biz_name,
            'location'           => $request->location,
            'created_by'         => Auth::id(),
        ]);

        return redirect()->route('agents.index')->with('success', 'Agent created successfully!');
    }

    public function edit(Agent $agent)
    {
        $agent->load('user');
        return Inertia::render('Agents/Form', [
            'agent' => $agent,
            'pageTitle' => 'editAgent'
        ]);
    }

    public function update(Request $request, Agent $agent)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $agent->user_id,
            'password' => 'nullable|string|min:8|confirmed',
            'biz_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string',
        ]);

        // Update the agent details
         $agent->user->update([
            'name' => $request->name,
            'email' => $request->email,
            'updated_by' => auth()->id(),
        ]);

        if ($request->filled('password')) {
            $agent->user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        // Update agent-specific fields
        $agent->update([
            'biz_name' => $request->biz_name,
            'phone' => $request->phone,
            'location' => $request->location,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('agents.index')->with('success', 'Agent updated successfully!');
    }

    public function destroy(Agent $agent)
    {
        $agent->delete();
        return redirect()->route('agents.index')->with('success', 'Agent deleted successfully!');
    }
}
