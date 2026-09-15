<?php

declare(strict_types=1);

namespace Modules\Auth\Infrastructure\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Modules\Auth\Domain\Models\User;
use Modules\Auth\Infrastructure\Notifications\WelcomeNotification;
use Modules\Wallet\Infrastructure\Services\WalletService;

/**
 * Example event-driven side effect: every new user gets a wallet and the
 * default role. Runs on the queue — registration stays fast.
 */
class ProvisionUserDefaults implements ShouldQueue
{
    use InteractsWithQueue;

    public int $tries = 3;

    public int $maxExceptions = 3;

    public int $timeout = 30;

    public bool $failOnTimeout = true;

    public string $queue = 'default';

    public function __construct(private readonly WalletService $wallets) {}

    public function backoff(): array
    {
        return [10, 30, 60];
    }

    public function retryUntil(): \DateTimeInterface
    {
        return now()->addHours(1);
    }

    public function handle(object $event): void
    {
        if (! property_exists($event, 'user') || ! ($event->user instanceof User)) {
            return;
        }

        $user = $event->user;
        $this->wallets->firstOrCreateFor($user);

        if (! $user->hasAnyRole()) {
            $user->assignRole('customer');
        }

        $user->notify(new WelcomeNotification);
    }
}
