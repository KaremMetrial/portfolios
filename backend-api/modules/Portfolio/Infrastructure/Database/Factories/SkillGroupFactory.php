<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Models\SkillGroup;

/**
 * @extends Factory<SkillGroup>
 */
class SkillGroupFactory extends Factory
{
    protected $model = SkillGroup::class;

    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(2),
            'name' => ['en' => fake()->words(2, true), 'ar' => fake()->words(2, true)],
            'icon' => null,
            'sort' => 0,
        ];
    }
}
