<?php

declare(strict_types=1);

namespace Modules\RBAC\Domain\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Modules\RBAC\Domain\Models\Role;

interface RoleRepositoryInterface
{
    /**
     * @return Collection<int, Role>
     */
    public function all(): Collection;

    public function findById(string $id): Role;

    public function findByName(string $name): Role;

    public function createWithMetadata(array $attributes, array $metadata = [], ?string $tenantId = null): Role;

    public function updateWithMetadata(Role $role, array $attributes, array $metadata = [], ?string $tenantId = null): Role;

    public function delete(Role $role): bool;
}
