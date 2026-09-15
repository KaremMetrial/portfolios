<?php

declare(strict_types=1);

namespace Modules\RBAC\Presentation\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Modules\RBAC\Infrastructure\Support\PermissionRegistry;
use Modules\Shared\Presentation\Http\Controllers\ApiController;

class PermissionController extends ApiController
{
    public function index(): JsonResponse
    {
        $this->authorize('rbac.permissions.view');

        // Return the structured tree (e.g. Domain -> Group -> Key: Value)
        return $this->respond(PermissionRegistry::tree());
    }
}
