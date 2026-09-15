<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Enums\Confidentiality;
use Modules\Portfolio\Domain\Enums\ProjectDomain;
use Modules\Portfolio\Domain\Enums\ProjectStatus;
use Modules\Portfolio\Domain\Enums\ProjectType;
use Modules\Portfolio\Domain\Models\Project;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(3),
            'title' => ['en' => fake()->words(3, true), 'ar' => fake()->words(3, true)],
            'tagline' => ['en' => fake()->sentence(), 'ar' => fake()->sentence()],
            'summary' => ['en' => fake()->paragraph(), 'ar' => fake()->paragraph()],
            'domain' => fake()->randomElement(ProjectDomain::cases()),
            'type' => ProjectType::Company,
            'role' => ['en' => 'Back-End Developer', 'ar' => 'Back-End Developer'],
            'started_on' => null,
            'ended_on' => null,
            'status' => ProjectStatus::Published,
            'confidentiality' => Confidentiality::Public,
            'is_featured' => false,
            'sort' => 0,
            'architecture' => null,
            'flow' => null,
            'published_at' => now(),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => ProjectStatus::Draft, 'published_at' => null]);
    }

    public function summaryOnly(): static
    {
        return $this->state(['confidentiality' => Confidentiality::SummaryOnly]);
    }

    public function hidden(): static
    {
        return $this->state(['confidentiality' => Confidentiality::Hidden]);
    }

    public function featured(): static
    {
        return $this->state(['is_featured' => true]);
    }
}
