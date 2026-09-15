<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Portfolio\Domain\Models\Testimonial;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    public function definition(): array
    {
        return [
            'author' => fake()->name(),
            'role' => ['en' => 'Engineering Manager', 'ar' => 'Engineering Manager'],
            'company' => fake()->company(),
            'quote' => ['en' => fake()->sentence(12), 'ar' => fake()->sentence(12)],
            'consent_given' => true,
            'is_published' => true,
            'sort' => 0,
        ];
    }
}
