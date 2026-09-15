<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Enums\SectionType;
use Modules\Portfolio\Domain\Models\Project;
use Modules\Portfolio\Domain\Models\ProjectSection;

/**
 * @extends Factory<ProjectSection>
 */
class ProjectSectionFactory extends Factory
{
    protected $model = ProjectSection::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'type' => SectionType::Context,
            'heading' => ['en' => fake()->words(2, true), 'ar' => fake()->words(2, true)],
            'body' => ['en' => fake()->paragraph(), 'ar' => fake()->paragraph()],
            'sort' => 0,
        ];
    }
}
