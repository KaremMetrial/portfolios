<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Models\Education;

/**
 * @extends Factory<Education>
 */
class EducationFactory extends Factory
{
    protected $model = Education::class;

    public function definition(): array
    {
        return [
            'institution' => ['en' => fake()->company().' University', 'ar' => fake()->company().' University'],
            'degree' => ['en' => 'BSc', 'ar' => 'BSc'],
            'field' => ['en' => 'Computer Science', 'ar' => 'Computer Science'],
            'started_year' => 2018,
            'ended_year' => 2022,
            'location' => ['en' => fake()->city(), 'ar' => fake()->city()],
            'sort' => 0,
        ];
    }
}
