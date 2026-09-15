<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Models\Skill;
use Modules\Portfolio\Domain\Models\SkillGroup;

/**
 * @extends Factory<Skill>
 */
class SkillFactory extends Factory
{
    protected $model = Skill::class;

    public function definition(): array
    {
        return [
            'skill_group_id' => SkillGroup::factory(),
            'key' => fake()->unique()->slug(2),
            'name' => ['en' => fake()->word(), 'ar' => fake()->word()],
            'icon' => null,
            'sort' => 0,
        ];
    }
}
