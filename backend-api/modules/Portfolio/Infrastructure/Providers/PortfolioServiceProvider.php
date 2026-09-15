<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Portfolio\Infrastructure\Services\ProofStatsService;

final class PortfolioServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ProofStatsService::class);
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');

        $routes = __DIR__.'/../../Presentation/routes/api.php';
        if (config('modules.portfolio', true) && file_exists($routes)) {
            $this->loadRoutesFrom($routes);
        }
    }
}
