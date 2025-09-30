<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

class ErrorController extends Controller
{
    /**
     * Handle validation errors
     */
    public function validationError(ValidationException $exception): JsonResponse
    {
        return response()->json([
            'message' => 'Los datos proporcionados no son válidos',
            'errors' => $exception->errors(),
        ], 422);
    }

    /**
     * Handle not found errors
     */
    public function notFound(NotFoundHttpException $exception): JsonResponse
    {
        return response()->json([
            'message' => 'Recurso no encontrado',
            'error' => 'Not Found'
        ], 404);
    }

    /**
     * Handle method not allowed errors
     */
    public function methodNotAllowed(MethodNotAllowedHttpException $exception): JsonResponse
    {
        return response()->json([
            'message' => 'Método no permitido',
            'error' => 'Method Not Allowed',
            'allowed_methods' => $exception->getHeaders()['Allow'] ?? []
        ], 405);
    }

    /**
     * Handle general errors
     */
    public function generalError(\Exception $exception): JsonResponse
    {
        $statusCode = 500;
        $message = 'Error interno del servidor';

        if (app()->environment('local')) {
            $message = $exception->getMessage();
        }

        return response()->json([
            'message' => $message,
            'error' => 'Internal Server Error'
        ], $statusCode);
    }
}
