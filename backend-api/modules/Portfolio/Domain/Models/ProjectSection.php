<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Portfolio\Domain\Enums\SectionType;
use Modules\Portfolio\Infrastructure\Database\Factories\ProjectSectionFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * @property string $id
 * @property string $project_id
 * @property SectionType $type
 * @property string $heading
 * @property string $body Markdown, never HTML (NFR-S6)
 * @property int $sort
 */
class ProjectSection extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $fillable = ['project_id', 'type', 'heading', 'body', 'sort'];

    protected array $translatable = ['heading', 'body'];

    // Section and link edits change the case study's `updated_at` (FR-BE-81).
    /** @var list<string> */
    protected $touches = ['project'];

    protected function casts(): array
    {
        return ['type' => SectionType::class, 'sort' => 'integer'];
    }

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    protected static function newFactory(): ProjectSectionFactory
    {
        return ProjectSectionFactory::new();
    }
}
