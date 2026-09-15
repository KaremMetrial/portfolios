<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Portfolio\Infrastructure\Database\Factories\SkillFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * @property string $id
 * @property string $skill_group_id
 * @property string $key
 * @property string $name
 * @property string|null $icon
 * @property int $sort
 * @property int|null $public_projects_count Loaded via withCount (FR-BE-05)
 * @property-read SkillGroup $group
 * @property-read Collection<int, Project> $projects
 */
class Skill extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $fillable = ['skill_group_id', 'key', 'name', 'icon', 'sort'];

    protected array $translatable = ['name'];

    protected function casts(): array
    {
        return ['sort' => 'integer'];
    }

    /** @return BelongsTo<SkillGroup, $this> */
    public function group(): BelongsTo
    {
        return $this->belongsTo(SkillGroup::class, 'skill_group_id');
    }

    /** @return BelongsToMany<Project, $this> */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    protected static function newFactory(): SkillFactory
    {
        return SkillFactory::new();
    }
}
