<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Portfolio\Infrastructure\Database\Factories\SkillGroupFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * One of the CV's skill groups (FR-BE-05).
 *
 * @property string $id
 * @property string $key
 * @property string $name
 * @property string|null $icon
 * @property int $sort
 * @property-read Collection<int, Skill> $skills
 */
class SkillGroup extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $fillable = ['key', 'name', 'icon', 'sort'];

    protected array $translatable = ['name'];

    protected function casts(): array
    {
        return ['sort' => 'integer'];
    }

    /** @return HasMany<Skill, $this> */
    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class)->orderBy('sort');
    }

    protected static function newFactory(): SkillGroupFactory
    {
        return SkillGroupFactory::new();
    }
}
