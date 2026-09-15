<?php

declare(strict_types=1);

namespace Modules\RBAC\Infrastructure\Repositories;

use Illuminate\Contracts\Database\Query\Expression;
use Illuminate\Database\Eloquent\Collection;
use Modules\RBAC\Domain\Contracts\PermissionRepositoryInterface;
use Modules\Shared\Infrastructure\Persistence\BaseRepository;
use Spatie\Permission\Models\Permission;

/**
 * @extends BaseRepository<Permission>
 */
class PermissionRepository extends BaseRepository implements PermissionRepositoryInterface
{
    public function __construct(Permission $model)
    {
        parent::__construct($model);
    }

    /**
     * @param  array<int, Expression|string>  $columns
     * @return Collection<int, Permission>
     */
    public function all(array $columns = ['*'], ?string $tenantId = null): Collection
    {
        /** @var Collection<int, Permission> $result */
        $result = $this->query($tenantId)->get($columns);

        return $result;
    }

    public function findByName(string $name): Permission
    {
        /** @var Permission $perm */
        $perm = $this->query()->where('name', $name)->firstOrFail();

        return clone $perm;
    }

    /**
     * @return Collection<int, Permission>
     */
    public function findByNames(array $names): Collection
    {
        /** @var Collection<int, Permission> $result */
        $result = $this->query()->whereIn('name', $names)->get();

        return $result;
    }
}
