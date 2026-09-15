<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Modules\Media\Domain\Models\Media;
use Modules\Portfolio\Infrastructure\Database\Factories\CvFileFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * A CV PDF version per locale; one `is_current` per locale (FR-BE-30).
 *
 * @property string $id
 * @property string $locale
 * @property string $media_id
 * @property bool $is_current
 * @property Carbon $uploaded_at
 * @property Carbon|null $updated_at
 * @property-read Media $media
 */
class CvFile extends Model
{
    use Auditable;
    use HasFactory;
    use HasUuid;

    protected $fillable = ['locale', 'media_id', 'is_current', 'uploaded_at'];

    protected function casts(): array
    {
        return ['is_current' => 'boolean', 'uploaded_at' => 'datetime'];
    }

    /** @return BelongsTo<Media, $this> */
    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }

    protected static function newFactory(): CvFileFactory
    {
        return CvFileFactory::new();
    }
}
