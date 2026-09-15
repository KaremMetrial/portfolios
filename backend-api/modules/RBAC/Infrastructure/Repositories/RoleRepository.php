<?php

declare(strict_types=1);

namespace Modules\RBAC\Infrastructure\Repositories;

use Illuminate\Contracts\Database\Query\Expression;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Modules\RBAC\Domain\Contracts\RoleRepositoryInterface;
use Modules\RBAC\Domain\Models\Role;
use Modules\Shared\Infrastructure\Persistence\BaseRepository;

/**
 * @extends BaseRepository<Role>
 */
class RoleRepository extends BaseRepository implements RoleRepositoryInterface
{
    public function __construct(Role $model)
    {
        parent::__construct($model);
    }

    /**
     * @param  array<int, Expression|string>  $columns
     * @return Collection<int, Role>
     */
    public function all(array $columns = ['*'], ?string $tenantId = null): Collection
    {
        $query = $this->model->with(['metadata', 'permissions']);

        if ($tenantId) {
            $query->where('tenant_id', $tenantId);
        }

        /** @var Collection<int, Role> $result */
        $result = $query->get($columns);

        return $result;
    }

    public function findById(string $id): Role
    {
        /** @var Role $role */
        $role = $this->query()->with('metadata')->findOrFail($id);

        return $role;
    }

    public function findByName(string $name): Role
    {
        /** @var Role $role */
        $role = $this->query()->with('metadata')->where('name', $name)->firstOrFail();

        return $role;
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @param  array<string, mixed>  $metadata
     */
    public function createWithMetadata(array $attributes, array $metadata = [], ?string $tenantId = null): Role
    {
        /** @var Role $role */
        $role = parent::create($attributes, $tenantId);

        if (! empty($metadata)) {
            $role->metadata()->create($metadata);
        }

        return $role->load('metadata');
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @param  array<string, mixed>  $metadata
     */
    public function updateWithMetadata(Role $role, array $attributes, array $metadata = [], ?string $tenantId = null): Role
    {
        if (! empty($attributes)) {
            parent::update($role, $attributes, $tenantId);
        }

        if (! empty($metadata)) {
            $role->metadata()->updateOrCreate(['role_id' => $role->id], $metadata);
        }

        /** @var Role $refreshed */
        $refreshed = $role->refresh()->load('metadata');

        return $refreshed;
    }

    /**
     * @param  Role  $role
     */
    public function delete(Model $role, ?string $tenantId = null): bool
    {
        return parent::delete($role, $tenantId);
    }
}
