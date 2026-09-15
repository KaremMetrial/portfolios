<?php

declare(strict_types=1);

namespace Modules\RBAC\Infrastructure\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Modules\RBAC\Domain\Models\Role;
use Modules\RBAC\Presentation\Policies\RolePolicy;

class RbacAuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Role::class => RolePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
