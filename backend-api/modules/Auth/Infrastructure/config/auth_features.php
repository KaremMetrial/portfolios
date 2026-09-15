<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Feature flags
    |--------------------------------------------------------------------------
    */
    // Gates SocialProviderStrategy::verifySocialIdentity(): whether the
    // provider token in a social login/callback request is actually
    // verified against the provider (Socialite::userFromToken +
    // id/email/audience checks) before trusting it. Defaults to true —
    // with this off, /auth/social/{provider}/callback trusts a raw
    // client-submitted {id, email} with zero verification, and
    // SocialIdentityService::loginOrRegister logs the caller in as
    // whichever existing user has that email. Only disable this for a
    // fully offline/local dev environment with no real user data.
    'social_login_v2_enabled' => env('FEATURE_SOCIAL_LOGIN_V2', true),

    // Gates /auth/register and /auth/otp/register (plan BE-0, FR-BE-25):
    // the portfolio has exactly one owner, created with
    // `php artisan portfolio:create-owner` — the public can never sign up.
    // Default true keeps the enterprise base's behavior; the portfolio's
    // env templates set this to false.
    'public_registration' => env('FEATURE_PUBLIC_REGISTRATION', true),

];
