<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\Auth\Domain\Models\User;
use Modules\Auth\Infrastructure\Services\MfaService;
use Modules\Shared\Domain\Contracts\AuditRecorder;

/**
 * Creates the single owner account (plan BE-0, FR-BE-25).
 *
 * Public self-registration is disabled for the portfolio, so this command is
 * the only way an account is born. It assigns `super-admin` (the owner role)
 * and, unless --skip-mfa is used for local convenience, enrolls TOTP MFA
 * interactively: the command prints the secret + otpauth URL, then waits for
 * a valid code from the authenticator app before confirming — the user only
 * leaves this command MFA-confirmed (login then demands a TOTP code).
 *
 * Idempotent per email: re-running for an existing owner re-syncs the role
 * and offers (re-)enrollment instead of duplicating the account.
 */
class CreatePortfolioOwner extends Command
{
    protected $signature = 'portfolio:create-owner
                            {--name= : Owner display name}
                            {--email= : Owner email address}
                            {--skip-mfa : Skip MFA enrollment (local only)}';

    protected $description = 'Create or update the portfolio owner account (super-admin) and enroll MFA';

    public function handle(MfaService $mfa, AuditRecorder $audit): int
    {
        $name = $this->option('name') !== null
            ? (string) $this->option('name')
            : $this->ask('Owner name');

        $email = $this->option('email') !== null
            ? strtolower((string) $this->option('email'))
            : strtolower((string) $this->ask('Owner email'));

        if ($name === '' || $email === '') {
            $this->error('Name and email are required.');

            return self::FAILURE;
        }

        $validator = Validator::make(
            ['email' => $email],
            ['email' => ['required', 'email']]
        );
        if ($validator->fails()) {
            $this->error('A valid email address is required.');

            return self::FAILURE;
        }

        $user = User::query()->where('email', $email)->first();

        if ($user === null) {
            $password = $this->secret('Owner password (min 12 chars)');

            if (! is_string($password) || strlen($password) < 12) {
                $this->error('Password must be at least 12 characters.');

                return self::FAILURE;
            }

            $confirm = $this->secret('Confirm password');
            if ($confirm !== $password) {
                $this->error('Passwords do not match.');

                return self::FAILURE;
            }

            $user = DB::transaction(function () use ($name, $email, $password, $audit): User {
                $user = User::query()->create([
                    'name' => $name,
                    'email' => $email,
                    'password' => $password,
                    'locale' => 'en',
                ]);
                $user->assignRole('super-admin');
                $audit->log('portfolio.owner_created', $user);

                return $user;
            });

            $this->info("Owner account created: {$user->email} (role: super-admin)");
        } else {
            // Existing account: re-sync the role, keep the password.
            if (! $user->hasRole('super-admin')) {
                $user->assignRole('super-admin');
                $this->info('Assigned missing super-admin role to existing account.');
            }
            $this->info("Owner account already exists: {$user->email} — role and MFA status verified.");
        }

        if ($this->option('skip-mfa') === true) {
            if (! app()->isLocal()) {
                $this->error('--skip-mfa is only allowed locally (NFR-S1: MFA is mandatory).');

                return self::FAILURE;
            }
            $this->warn('Skipping MFA enrollment (local only).');

            return self::SUCCESS;
        }

        return $this->enrollMfa($user, $mfa);
    }

    private function enrollMfa(User $user, MfaService $mfa): int
    {
        if ($user->hasMfaEnabled()) {
            $this->info('MFA is already enabled and confirmed for this account.');

            return self::SUCCESS;
        }

        $this->info('Enrolling MFA (mandatory for admin users — NFR-S1).');
        $enrollment = $mfa->enable($user);

        $this->line('  Secret: <fg=yellow;options=bold>'.$enrollment['secret'].'</>');
        $this->line('  Add it to your authenticator app (Google Authenticator, 1Password, ...):');
        $this->line('  <fg=blue>'.$enrollment['qr_url'].'</>');
        $this->newLine();
        foreach ($enrollment['recovery_codes'] as $code) {
            $this->line("  recovery: {$code}");
        }
        $this->newLine();
        $this->warn('  Store the recovery codes somewhere safe — they are shown only once.');

        // Confirm immediately: without this the enrollment is pending and
        // login would still work with a bare password.
        for ($attempt = 1; $attempt <= 3; $attempt++) {
            $code = $this->secret('Enter the 6-digit code from your authenticator app');
            if (is_string($code) && $mfa->confirm($user, trim($code))) {
                $this->info('MFA confirmed. This account is ready to administer the portfolio.');

                return self::SUCCESS;
            }
            $this->error('Invalid code'.($attempt < 3 ? ', try again.' : ' — enrollment stays pending; rerun the command to retry.'));
        }

        return self::FAILURE;
    }
}
