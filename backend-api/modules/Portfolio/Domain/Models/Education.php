<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Portfolio\Infrastructure\Database\Factories\EducationFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * @property string $id
 * @property string $institution
 * @property string $degree
 * @property string $field
 * @property int $started_year
 * @property int|null $ended_year
 * @property string $location
 * @property int $sort
 */
class Education extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $table = 'education';

    protected $fillable = ['institution', 'degree', 'field', 'started_year', 'ended_year', 'location', 'sort'];

    protected array $translatable = ['institution', 'degree', 'field', 'location'];

    protected function casts(): array
    {
        return ['started_year' => 'integer', 'ended_year' => 'integer', 'sort' => 'integer'];
    }

    protected static function newFactory(): EducationFactory
    {
        return EducationFactory::new();
    }
}
