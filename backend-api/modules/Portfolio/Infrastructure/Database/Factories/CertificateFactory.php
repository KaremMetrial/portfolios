<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Models\Certificate;

/**
 * @extends Factory<Certificate>
 */
class CertificateFactory extends Factory
{
    protected $model = Certificate::class;

    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(2),
            'issuer' => ['en' => fake()->company(), 'ar' => fake()->company()],
            'title' => ['en' => fake()->words(3, true), 'ar' => fake()->words(3, true)],
            'issued_on' => null,
            'credential_url' => null,
            'sort' => 0,
        ];
    }
}
