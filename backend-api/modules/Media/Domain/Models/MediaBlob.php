<?php

declare(strict_types=1);

namespace Modules\Media\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Modules\Shared\Infrastructure\Traits\BelongsToTenant;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * Represents the physical file stored in object storage or local disk.
 * Supports soft deletes and tenant-scoped deduplication.
 *
 * @property string $id
 * @property string|null $tenant_id
 * @property string $sha256
 * @property string $disk
 * @property string $path
 * @property string $filename
 * @property string|null $original_filename
 * @property string $mime_type
 * @property int $size
 * @property string|null $virus_status
 * @property array|null $virus_scan_details
 * @property string|null $storage_provider
 * @property string|null $bucket
 * @property string|null $region
 * @property string|null $etag
 * @property string|null $storage_class
 * @property string|null $encryption
 * @property string|null $kms_key
 * @property string|null $multipart_upload_id
 * @property Carbon|null $uploaded_at
 * @property Carbon|null $verified_at
 * @property Carbon|null $last_accessed_at
 * @property int $access_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class MediaBlob extends Model
{
    use BelongsToTenant;
    use HasUuid;
    use SoftDeletes;

    protected $table = 'media_blobs';

    protected $fillable = [
        'tenant_id',
        'sha256',
        'disk',
        'path',
        'filename',
        'original_filename',
        'mime_type',
        'size',
        'virus_status',
        'virus_scan_details',
        'storage_provider',
        'bucket',
        'region',
        'etag',
        'storage_class',
        'encryption',
        'kms_key',
        'multipart_upload_id',
        'uploaded_at',
        'verified_at',
        'last_accessed_at',
        'access_count',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'virus_scan_details' => 'array',
            'uploaded_at' => 'datetime',
            'verified_at' => 'datetime',
            'last_accessed_at' => 'datetime',
            'access_count' => 'integer',
        ];
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Media::class, 'media_blob_id');
    }
}
