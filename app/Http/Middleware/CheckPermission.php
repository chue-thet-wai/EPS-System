<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class CheckPermission
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            abort(403, 'Unauthorized action.');
        }

        $routeName = $request->route()->getName();

        $permission = Permission::where('route', $routeName)->first();

        if (!$permission) {
            if (str_ends_with($routeName, '.store')) {
                $permission = Permission::where('route', str_replace('.store', '.create', $routeName))->first();
            } elseif (str_ends_with($routeName, '.import')) {
                $permission = Permission::where('route', str_replace('.import', '.create', $routeName))->first();
            } elseif (str_ends_with($routeName, '.update')) {
                $permission = Permission::where('route', str_replace('.update', '.edit', $routeName))->first();
            } else if (str_ends_with($routeName,'.show')) {
                return $next($request);
            } else if (str_ends_with($routeName,'.filter')) {
                return $next($request);
            }
        }

        if (!$permission || !Auth::user()->can($permission->name)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
