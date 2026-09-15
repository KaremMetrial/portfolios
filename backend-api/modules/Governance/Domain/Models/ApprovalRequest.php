<?php

declare(strict_types=1);

namespace Modules\Governance\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Modules\Auth\Domain\Models\User;
use Modules\Governance\Domain\Enums\ApprovalStatus;
use Modules\Shared\Infrastructure\Traits\BelongsToTenant;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * @property string $id
 * @property string|null $tenant_id
 * @property string $action
 * @property array $payload
 * @property ApprovalStatus $status
 * @property string|null $reason
 * @property string $requested_by
 * @property string|null $decided_by
 * @property Carbon|null $decided_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property User|null $requester
 * @property User|null $approver
 */
class ApprovalRequest extends Model
{
    use BelongsToTenant;
    use HasUuid;

    protected $fillable = [
        'tenant_id', 'action', 'payload', 'status', 'reason',
        'requested_by', 'decided_by', 'decided_at',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'status' => ApprovalStatus::class,
            'decided_at' => 'datetime',
        ];
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'decided_by');
    }
}
