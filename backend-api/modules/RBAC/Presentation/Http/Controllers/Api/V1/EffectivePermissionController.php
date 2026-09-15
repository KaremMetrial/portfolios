<?php

declare(strict_types=1);

namespace Modules\RBAC\Presentation\Http\Controllers\Api\V1;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Modules\Auth\Domain\Models\User;
use Modules\RBAC\Domain\Models\Role;
use Modules\Shared\Presentation\Http\Controllers\ApiController;
use Spatie\Permission\Models\Permission;

class EffectivePermissionController extends ApiController
{
    public function show(User $user): JsonResponse
    {
        // Users can always view their own effective permissions.
        // Viewing another user's permissions requires the rbac.permissions.view permission.
        if ($user->id !== request()->user()?->id) {
            $this->authorize('rbac.permissions.view');
        }

        $roles = array_map(fn ($v) => is_scalar($v) ? (string) $v : '', $user->roles()->pluck('name')->toArray());
        $directPermissions = array_map(fn ($v) => is_scalar($v) ? (string) $v : '', $user->getDirectPermissions()->pluck('name')->toArray());
        $allPermissions = array_map(fn ($v) => is_scalar($v) ? (string) $v : '', $user->getAllPermissions()->pluck('name')->toArray());

        // Build the source map
        $sourceMap = [];
        /** @var Collection<int, Role> $userRoles */
        $userRoles = $user->roles()->with('permissions')->get();
        foreach ($userRoles as $role) {
            foreach ($role->permissions as $permission) {
                /** @var Permission $permission */
                $sourceMap[$permission->name] = "Role: {$role->name}";
            }
        }
        foreach ($directPermissions as $dp) {
            $sourceMap[$dp] = 'Direct Permission';
        }

        return $this->respond([
            'roles' => $roles,
            'direct_permissions' => $directPermissions,
            'effective_permissions' => $allPermissions,
            'source_map' => $sourceMap,
        ]);
    }
}
