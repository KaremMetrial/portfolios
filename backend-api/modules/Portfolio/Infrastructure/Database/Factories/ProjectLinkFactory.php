<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Enums\LinkKind;
use Modules\Portfolio\Domain\Models\Project;
use Modules\Portfolio\Domain\Models\ProjectLink;

/**
 * @extends Factory<ProjectLink>
 */
class ProjectLinkFactory extends Factory
{
    protected $model = ProjectLink::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'kind' => LinkKind::Website,
            'url' => fake()->unique()->url(),
            'label' => ['en' => 'Website', 'ar' => 'Website'],
            'sort' => 0,
        ];
    }

    public function playStore(): static
    {
        return $this->state(fn () => [
            'kind' => LinkKind::PlayStore,
            'url' => 'https://play.google.com/store/apps/details?id=com.example.'.fake()->unique()->lexify('????????'),
        ]);
    }
}
