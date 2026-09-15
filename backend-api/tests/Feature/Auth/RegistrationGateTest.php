<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationGateTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_registration_is_rejected_when_public_registration_is_disabled(): void
    {
        config()->set('auth_features.public_registration', false);

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Kareem Sabry',
            'email' => 'owner@example.com',
            'password' => 'sup3r-Secret-Passphrase',
            'password_confirmation' => 'sup3r-Secret-Passphrase',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('error.code', 'registration_disabled');
    }

    public function test_otp_registration_is_rejected_when_public_registration_is_disabled(): void
    {
        config()->set('auth_features.public_registration', false);

        $response = $this->postJson('/api/v1/auth/otp/register', [
            'name' => 'Kareem Sabry',
            'identifier' => '+201012345678',
            'code' => '123456',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('error.code', 'registration_disabled');
    }

    public function test_disabled_registration_rejects_before_validation_runs(): void
    {
        config()->set('auth_features.public_registration', false);

        // An empty body must not reveal the endpoint's validation rules.
        $this->postJson('/api/v1/auth/register', [])
            ->assertStatus(403)
            ->assertJsonPath('error.code', 'registration_disabled');

        $this->postJson('/api/v1/auth/otp/register', [])
            ->assertStatus(403)
            ->assertJsonPath('error.code', 'registration_disabled');
    }
}
