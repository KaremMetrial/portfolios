<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Modules\Media\Domain\Models\Media;
use Illuminate\Support\Carbon;
use Modules\Portfolio\Domain\Enums\Confidentiality;
use Modules\Portfolio\Domain\Enums\ProjectDomain;
use Modules\Portfolio\Domain\Enums\ProjectStatus;
use Modules\Portfolio\Domain\Enums\ProjectType;
use Modules\Portfolio\Infrastructure\Database\Factories\ProjectFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * A case study (FR-BE-03).
 *
 * @property string $id
 * @property string $slug
 * @property string $title
 * @property string $tagline
 * @property string $summary
 * @property ProjectDomain $domain
 * @property ProjectType $type
 * @property string $role
 * @property Carbon|null $started_on
 * @property Carbon|null $ended_on
 * @property ProjectStatus $status
 * @property Confidentiality $confidentiality
 * @property bool $is_featured
 * @property int $sort
 * @property array<string, mixed>|null $architecture
 * @property array<string, mixed>|null $flow
 * @property Carbon|null $published_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, ProjectSection> $sections
 * @property-read Collection<int, ProjectLink> $links
 * @property-read Collection<int, Skill> $skills
 * @property-read Collection<int, Experience> $experiences
 */
class Project extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $fillable = [
        'slug', 'title', 'tagline', 'summary', 'domain', 'type', 'role', 'started_on', 'ended_on', 'status',
        'confidentiality', 'is_featured', 'sort', 'architecture', 'flow', 'published_at',
    ];

    protected array $translatable = ['title', 'tagline', 'summary', 'role'];

    protected function casts(): array
    {
        return [
            'domain' => ProjectDomain::class,
            'type' => ProjectType::class,
            'status' => ProjectStatus::class,
            'confidentiality' => Confidentiality::class,
            'is_featured' => 'boolean',
            'sort' => 'integer',
            'started_on' => 'date',
            'ended_on' => 'date',
            'architecture' => 'array',
            'flow' => 'array',
            'published_at' => 'datetime',
        ];
    }

    /** @param Builder<Project> $query */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', ProjectStatus::Published->value);
    }

    /**
     * Everything a public endpoint may ever see, including counts (FR-BE-04):
     * published and not hidden. `summary_only` stays in, trimmed by resources.
     *
     * @param  Builder<Project>  $query
     */
    public function scopePubliclyVisible(Builder $query): void
    {
        $query->published()->where('confidentiality', '!=', Confidentiality::Hidden->value);
    }

    /** @param Builder<Project> $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort')->orderBy('slug');
    }

    public function isPubliclyVisible(): bool
    {
        return $this->status === ProjectStatus::Published && $this->confidentiality !== Confidentiality::Hidden;
    }

    public function isSummaryOnly(): bool
    {
        return $this->confidentiality === Confidentiality::SummaryOnly;
    }

    /** @return HasMany<ProjectSection, $this> */
    public function sections(): HasMany
    {
        return $this->hasMany(ProjectSection::class)->orderBy('sort');
    }

    /** @return HasMany<ProjectLink, $this> */
    public function links(): HasMany
    {
        return $this->hasMany(ProjectLink::class)->orderBy('sort');
    }

    /** @return BelongsToMany<Skill, $this> */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class)->withPivot('sort')->orderByPivot('sort');
    }

    /** @return MorphMany<Media, $this> */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /** @return MorphOne<SeoMeta, $this> */
    public function seo(): MorphOne
    {
        return $this->morphOne(SeoMeta::class, 'seoable');
    }

    /** @return BelongsToMany<Experience, $this> */
    public function experiences(): BelongsToMany
    {
        return $this->belongsToMany(Experience::class);
    }

    protected static function newFactory(): ProjectFactory
    {
        return ProjectFactory::new();
    }
}
