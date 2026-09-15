<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Media\Domain\Enums\MediaStatus;
use Modules\Media\Domain\Enums\MediaType;
use Modules\Media\Domain\Models\Media;
use Modules\Portfolio\Domain\Models\CvFile;

/**
 * @extends Factory<CvFile>
 */
class CvFileFactory extends Factory
{
    protected $model = CvFile::class;

    public function definition(): array
    {
        return [
            'locale' => 'en',
            'media_id' => fn () => Media::query()->create([
                'media_type' => MediaType::Document,
                'purpose' => 'cv',
                'is_public' => false,
                'status' => MediaStatus::Active,
            ])->id,
            'is_current' => true,
            'uploaded_at' => now(),
        ];
    }
}
