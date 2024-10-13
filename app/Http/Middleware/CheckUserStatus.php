<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();

            // Verificar si el usuario no está activo
            if (! $user->is_active) {
                Auth::logout();

                return redirect()->route('login')->withErrors([
                    'dni' => 'No puedes acceder porque tu cuenta está inactiva.',
                ]);
            }
        }

        return $next($request);
    }
}
