<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Enums\Availability;
use Modules\Portfolio\Domain\Models\Profile;

/**
 * @extends Factory<Profile>
 */
class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    public function definition(): array
    {
        return [
            'name' => ['en' => fake()->name(), 'ar' => fake()->name()],
            'headline' => ['en' => 'Backend Software Engineer', 'ar' => 'Backend Software Engineer'],
            'summary' => ['en' => fake()->paragraph(), 'ar' => fake()->paragraph()],
            'about' => ['en' => fake()->paragraphs(2, true), 'ar' => fake()->paragraphs(2, true)],
            'location' => ['en' => fake()->city(), 'ar' => fake()->city()],
            'availability' => Availability::OpenToRelocation,
            'availability_text' => ['en' => 'Open to relocation', 'ar' => 'Open to relocation'],
            'open_to_relocation' => true,
            'email' => fake()->safeEmail(),
            'phone' => fake()->e164PhoneNumber(),
            'phone_visible' => false,
        ];
    }
}
