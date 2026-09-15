<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Enums\SocialPlatform;
use Modules\Portfolio\Domain\Models\Profile;
use Modules\Portfolio\Domain\Models\SocialLink;

/**
 * @extends Factory<SocialLink>
 */
class SocialLinkFactory extends Factory
{
    protected $model = SocialLink::class;

    public function definition(): array
    {
        return [
            'profile_id' => Profile::factory(),
            'platform' => fake()->randomElement(SocialPlatform::cases()),
            'url' => fake()->url(),
            'sort' => 0,
        ];
    }
}
