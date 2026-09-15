<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Enums\EmploymentType;
use Modules\Portfolio\Domain\Models\Experience;

/**
 * @extends Factory<Experience>
 */
class ExperienceFactory extends Factory
{
    protected $model = Experience::class;

    public function definition(): array
    {
        return [
            'company' => fake()->unique()->company(),
            'company_url' => null,
            'role' => ['en' => 'Backend Developer', 'ar' => 'Backend Developer'],
            'employment_type' => EmploymentType::FullTime,
            'location' => ['en' => fake()->city(), 'ar' => fake()->city()],
            'started_on' => fake()->dateTimeBetween('-3 years', '-1 year')->format('Y-m-01'),
            'ended_on' => null,
            'highlights' => ['en' => [fake()->sentence(), fake()->sentence()], 'ar' => [fake()->sentence()]],
            'sort' => 0,
        ];
    }

    public function internship(): static
    {
        return $this->state(['employment_type' => EmploymentType::Internship]);
    }

    public function ended(string $endedOn): static
    {
        return $this->state(['ended_on' => $endedOn]);
    }
}
