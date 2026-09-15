<?php

declare(strict_types=1);

namespace Modules\Auth\Presentation\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Shared\Application\Exceptions\ApiException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Public self-registration is platform-gated (FR-BE-25): single-owner
 * products create accounts via `portfolio:create-owner` instead.
 *
 * Runs as route middleware, before the FormRequest resolves, so a disabled
 * endpoint answers 403 without leaking its validation rules.
 */
final class EnsurePublicRegistrationEnabled
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('auth_features.public_registration')) {
            throw new ApiException(
                __('auth.registration_disabled'),
                status: 403,
                errorCode: 'registration_disabled'
            );
        }

        return $next($request);
    }
}
