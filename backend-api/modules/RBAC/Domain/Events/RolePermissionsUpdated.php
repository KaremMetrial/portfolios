<?php

declare(strict_types=1);

namespace Modules\RBAC\Domain\Events;

use Modules\RBAC\Domain\Models\Role;
use Modules\Shared\Domain\Events\DomainEvent;

class RolePermissionsUpdated extends DomainEvent
{
    /**
     * @param  array<int, string>  $permissions
     */
    public function __construct(public readonly Role $role, public readonly array $permissions)
    {
        parent::__construct();
    }

    public function eventName(): string
    {
        return 'rbac.role.permissions.updated';
    }

    public function payload(): array
    {
        return [
            'role_id' => $this->role->id,
            'role_name' => $this->role->name,
            'permissions_count' => count($this->permissions),
            'permissions' => $this->permissions,
        ];
    }
}
