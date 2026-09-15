<?php

declare(strict_types=1);

namespace Modules\RBAC\Domain\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;

interface PermissionRepositoryInterface
{
    /**
     * @return Collection<int, Permission>
     */
    public function all(): Collection;

    public function findByName(string $name): Permission;

    /**
     * @param  array<int, string>  $names
     * @return Collection<int, Permission>
     */
    public function findByNames(array $names): Collection;
}
