<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Modules\Media\Domain\Models\Media;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * Owner-edited SEO fields for a page or a model (FR-BE-82). Empty fields are
 * returned as null so the frontend applies its localized templates.
 *
 * @property string $id
 * @property string|null $seoable_type
 * @property string|null $seoable_id
 * @property string|null $page_key
 * @property string|null $title
 * @property string|null $description
 * @property string|null $og_media_id
 * @property bool $noindex
 * @property-read Media|null $ogMedia
 */
class SeoMeta extends Model
{
    use Auditable;
    use HasTranslations;
    use HasUuid;

    protected $table = 'seo_meta';

    protected $fillable = ['seoable_type', 'seoable_id', 'page_key', 'title', 'description', 'og_media_id', 'noindex'];

    protected array $translatable = ['title', 'description'];

    protected function casts(): array
    {
        return ['noindex' => 'boolean'];
    }

    /** @return MorphTo<Model, $this> */
    public function seoable(): MorphTo
    {
        return $this->morphTo();
    }

    /** @return BelongsTo<Media, $this> */
    public function ogMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'og_media_id');
    }
}
