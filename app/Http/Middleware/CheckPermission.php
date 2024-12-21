<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        if (!Auth::check() || !$request->user()->can($permission)) {
            // If the user doesn't have permission, return a 403 response
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
