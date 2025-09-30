<?php

return [

    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    |
    | Here you can configure various settings for the API including
    | pagination, rate limiting, and response formatting.
    |
    */

    'pagination' => [
        'per_page' => env('API_PER_PAGE', 15),
        'max_per_page' => env('API_MAX_PER_PAGE', 100),
    ],

    'rate_limiting' => [
        'enabled' => env('API_RATE_LIMITING', true),
        'requests_per_minute' => env('API_RATE_LIMIT_PER_MINUTE', 60),
    ],

    'cors' => [
        'allowed_origins' => env('API_CORS_ORIGINS', '*'),
        'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
        'exposed_headers' => [],
        'max_age' => 86400,
        'supports_credentials' => false,
    ],

    'response' => [
        'include_meta' => true,
        'include_links' => true,
        'default_format' => 'json',
    ],

    'validation' => [
        'return_all_errors' => true,
        'custom_messages' => [
            'required' => 'El campo :attribute es obligatorio.',
            'email' => 'El campo :attribute debe ser un email válido.',
            'unique' => 'El :attribute ya está en uso.',
            'exists' => 'El :attribute seleccionado no es válido.',
            'date' => 'El campo :attribute debe ser una fecha válida.',
            'numeric' => 'El campo :attribute debe ser un número.',
            'min' => 'El campo :attribute debe ser al menos :min.',
            'max' => 'El campo :attribute no puede ser mayor a :max.',
            'in' => 'El :attribute seleccionado no es válido.',
        ],
    ],

    'cache' => [
        'enabled' => env('API_CACHE_ENABLED', false),
        'ttl' => env('API_CACHE_TTL', 300), // 5 minutes
    ],

];
