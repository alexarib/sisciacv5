<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Producer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de entrada inválidos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $credentials = $request->only('username', 'password');

            // Try to authenticate with username
            if (Auth::attempt($credentials)) {
                $user = Auth::user();

                // Check if user is active (simplified check)
                if ($user->status !== 'active') {
                    Auth::logout();
                    return response()->json([
                        'success' => false,
                        'message' => 'Tu cuenta está inactiva. Contacta al administrador.'
                    ], 401);
                }

                // Update last login
                $user->update(['last_login_at' => now()]);

                // Generate simple token (temporary solution without Sanctum)
                $token = base64_encode($user->id . '|' . $user->email . '|' . time());

                return response()->json([
                    'success' => true,
                    'message' => 'Inicio de sesión exitoso',
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'role' => $user->role,
                        'role_display' => $user->role_display ?? ucfirst($user->role),
                        'avatar' => $user->avatar,
                        'phone' => $user->phone,
                        'address' => $user->address,
                        'document_number' => $user->document_number,
                        'document_type' => $user->document_type,
                    ],
                    'token' => $token
                ]);
            }

            // Try to authenticate with email
            $credentials = [
                'email' => $request->username,
                'password' => $request->password
            ];

            if (Auth::attempt($credentials)) {
                $user = Auth::user();

                // Check if user is active (simplified check)
                if ($user->status !== 'active') {
                    Auth::logout();
                    return response()->json([
                        'success' => false,
                        'message' => 'Tu cuenta está inactiva. Contacta al administrador.'
                    ], 401);
                }

                // Update last login
                $user->update(['last_login_at' => now()]);

                // Generate simple token (temporary solution without Sanctum)
                $token = base64_encode($user->id . '|' . $user->email . '|' . time());

                return response()->json([
                    'success' => true,
                    'message' => 'Inicio de sesión exitoso',
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'role' => $user->role,
                        'role_display' => $user->role_display ?? ucfirst($user->role),
                        'avatar' => $user->avatar,
                        'phone' => $user->phone,
                        'address' => $user->address,
                        'document_number' => $user->document_number,
                        'document_type' => $user->document_type,
                    ],
                    'token' => $token
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas'
            ], 401);

        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Register new user
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'document_number' => 'nullable|string|max:20',
            'document_type' => 'nullable|in:dni,ruc,ce',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'producer',
                'status' => 'pending',
                'phone' => $request->phone,
                'address' => $request->address,
                'document_number' => $request->document_number,
                'document_type' => $request->document_type,
            ]);

            // Create associated producer record
            Producer::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'document_number' => $user->document_number,
                'document_type' => $user->document_type,
                'total_area' => 0,
                'status' => 'pending',
                'notes' => 'Usuario registrado desde el sistema web'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado exitosamente. Tu cuenta será activada por el administrador.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar usuario. Intenta nuevamente.'
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        // Simple logout without Sanctum
        Auth::logout();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    /**
     * Get current user
     */
    public function me(Request $request): JsonResponse
    {
        // Get user from token or session
        $user = Auth::user();
        
        if (!$user) {
            // Try to get user from token header
            $token = $request->header('Authorization');
            if ($token && strpos($token, 'Bearer ') === 0) {
                $token = substr($token, 7);
                $tokenData = base64_decode($token);
                $parts = explode('|', $tokenData);
                if (count($parts) >= 2) {
                    $user = User::where('email', $parts[1])->first();
                }
            }
        }

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'role_display' => $user->role_display,
                'avatar' => $user->avatar,
                'phone' => $user->phone,
                'address' => $user->address,
                'document_number' => $user->document_number,
                'document_type' => $user->document_type,
                'last_login_at' => $user->last_login_at,
            ]
        ]);
    }

    /**
     * Forgot password
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró una cuenta con ese correo electrónico'
            ], 422);
        }

        // Here you would typically send a password reset email
        // For now, we'll just return a success message

        return response()->json([
            'success' => true,
            'message' => 'Se han enviado las instrucciones de recuperación a tu correo electrónico'
        ]);
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Here you would typically verify the reset token
        // For now, we'll just update the password directly

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => Hash::make($request->password)]);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada exitosamente'
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'La contraseña actual es incorrecta'
            ], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada exitosamente'
        ]);
    }
}
