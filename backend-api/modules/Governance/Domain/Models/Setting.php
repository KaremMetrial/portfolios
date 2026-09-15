<?php

declare(strict_types=1);

namespace Modules\Governance\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Modules\Shared\Infrastructure\Traits\BelongsToTenant;

/**
 * @property int|string $id
 * @property string|null $tenant_id
 * @property string $key
 * @property array $value
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Setting extends Model
{
    use BelongsToTenant;

    protected $fillable = ['tenant_id', 'key', 'value', 'description'];

    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }
}
