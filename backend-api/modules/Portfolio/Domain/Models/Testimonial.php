<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Portfolio\Infrastructure\Database\Factories\TestimonialFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * @property string $id
 * @property string $author
 * @property string $role
 * @property string|null $company
 * @property string $quote
 * @property bool $consent_given
 * @property bool $is_published
 * @property int $sort
 */
class Testimonial extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $fillable = ['author', 'role', 'company', 'quote', 'consent_given', 'is_published', 'sort'];

    protected array $translatable = ['role', 'quote'];

    protected function casts(): array
    {
        return ['consent_given' => 'boolean', 'is_published' => 'boolean', 'sort' => 'integer'];
    }

    /**
     * Public only with explicit consent (FR-BE-06).
     *
     * @param  Builder<Testimonial>  $query
     */
    public function scopePubliclyVisible(Builder $query): void
    {
        $query->where('is_published', true)->where('consent_given', true)->orderBy('sort');
    }

    protected static function newFactory(): TestimonialFactory
    {
        return TestimonialFactory::new();
    }
}
