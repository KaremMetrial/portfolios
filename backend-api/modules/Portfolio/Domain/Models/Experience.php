<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;
use Modules\Portfolio\Domain\Enums\EmploymentType;
use Modules\Portfolio\Infrastructure\Database\Factories\ExperienceFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * A role in the timeline (FR-BE-02). `ended_on` null means Present.
 *
 * @property string $id
 * @property string $company
 * @property string|null $company_url
 * @property string $role
 * @property EmploymentType $employment_type
 * @property string $location
 * @property Carbon $started_on
 * @property Carbon|null $ended_on
 * @property list<string> $highlights
 * @property int $sort
 * @property-read Collection<int, Project> $projects
 */
class Experience extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $fillable = [
        'company', 'company_url', 'role', 'employment_type', 'location', 'started_on', 'ended_on', 'highlights', 'sort',
    ];

    protected array $translatable = ['role', 'location', 'highlights'];

    protected function casts(): array
    {
        return [
            'employment_type' => EmploymentType::class,
            'started_on' => 'date',
            'ended_on' => 'date',
            'sort' => 'integer',
        ];
    }

    public function isCurrent(): bool
    {
        return $this->ended_on === null;
    }

    /** @param Builder<Experience> $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort')->orderByDesc('started_on');
    }

    /** @return BelongsToMany<Project, $this> */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    protected static function newFactory(): ExperienceFactory
    {
        return ExperienceFactory::new();
    }
}
