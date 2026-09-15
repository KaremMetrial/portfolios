<?php

declare(strict_types=1);

use App\Http\Middleware\ApiDocumentationAccess;
use Modules\Shared\Infrastructure\OpenApi\SanctumSecurityDocumentationStrategy;

return [
    'api_path' => ['include' => 'api/v1', 'exclude' => ['api/internal']],
    'api_domain' => null,
    'export_path' => 'artifacts/openapi/api.json',
    'cache' => ['key' => 'scramble.openapi', 'store' => 'file'],
    'info' => [
        'version' => env('API_VERSION', 'v1'),
        'description' => 'Metrial Portfolio API: the content, contact, analytics, and live-showcase API behind Kareem Sabry\'s (Karem Metrial) portfolio. Read-mostly public content endpoints, an owner-only admin, and a live backend exhibit.',
    ],
    'ui' => ['title' => 'Metrial Portfolio API'],
    'renderer' => 'elements',
    'middleware' => ['web', ApiDocumentationAccess::class],
    'security_strategy' => SanctumSecurityDocumentationStrategy::class,
];
