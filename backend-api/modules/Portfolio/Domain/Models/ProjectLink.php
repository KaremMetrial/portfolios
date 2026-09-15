<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Portfolio\Domain\Enums\LinkKind;
use Modules\Portfolio\Infrastructure\Database\Factories\ProjectLinkFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * @property string $id
 * @property string $project_id
 * @property LinkKind $kind
 * @property string $url
 * @property string $label
 * @property int $sort
 */
class ProjectLink extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $fillable = ['project_id', 'kind', 'url', 'label', 'sort'];

    protected array $translatable = ['label'];

    // Section and link edits change the case study's `updated_at` (FR-BE-81).
    /** @var list<string> */
    protected $touches = ['project'];

    protected function casts(): array
    {
        return ['kind' => LinkKind::class, 'sort' => 'integer'];
    }

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    protected static function newFactory(): ProjectLinkFactory
    {
        return ProjectLinkFactory::new();
    }
}
