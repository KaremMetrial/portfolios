<?php

declare(strict_types=1);

namespace Modules\Media\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Media\Domain\Enums\MediaVariantType;
use Modules\Shared\Infrastructure\Traits\HasUuid;

class MediaVariant extends Model
{
    use HasUuid;

    protected $table = 'media_variants';

    protected $fillable = [
        'media_id',
        'variant',
        'path',
        'mime_type',
        'checksum',
        'hash_algorithm',
        'disk',
        'storage_provider',
        'is_generated',
        'processing_time_ms',
        'width',
        'height',
        'size',
    ];

    protected function casts(): array
    {
        return [
            'variant' => MediaVariantType::class,
            'is_generated' => 'boolean',
            'processing_time_ms' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'size' => 'integer',
        ];
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
    }
}
