<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Portfolio\Infrastructure\Database\Seeders\PortfolioContentSeeder;
use Modules\RBAC\Infrastructure\Database\Seeders\RolesAndPermissionsSeeder;
use Modules\Territory\Infrastructure\Database\Seeders\TerritorySeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            TerritorySeeder::class,
        ]);

        // Portfolio CV content is the default local dataset (plan BE-1). Tests
        // build their own fixtures and seed it explicitly when needed.
        if (! app()->environment('testing')) {
            $this->call(PortfolioContentSeeder::class);
        }

        // Enterprise demo data is opt-in for the portfolio (plan BE-0):
        // `SEED_ENTERPRISE_DEMO=true` when you want the full-base demo rows.
        // Never in `testing`: tests build their own fixtures — demo rows
        // (e.g. long-lived exchange rates) would mask them.
        if (config('modules.seed_enterprise_demo') && app()->environment(['local', 'staging'])) {
            $this->call(EnterpriseDemoSeeder::class);
        }
    }
}
