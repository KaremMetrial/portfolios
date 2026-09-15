<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\Portfolio\Domain\Enums\RedirectType;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * An old slug that permanently redirects to the current one (FR-BE-83).
 *
 * @property string $id
 * @property RedirectType $type
 * @property string $old_slug
 * @property string $new_slug
 */
class SlugRedirect extends Model
{
    use HasUuid;

    protected $fillable = ['type', 'old_slug', 'new_slug'];

    protected function casts(): array
    {
        return ['type' => RedirectType::class];
    }
}
