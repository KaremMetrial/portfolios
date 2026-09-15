<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Modules\Portfolio\Infrastructure\Database\Factories\CertificateFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * @property string $id
 * @property string $key
 * @property string $issuer
 * @property string $title
 * @property Carbon|null $issued_on
 * @property string|null $credential_url
 * @property int $sort
 */
class Certificate extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $fillable = ['key', 'issuer', 'title', 'issued_on', 'credential_url', 'sort'];

    protected array $translatable = ['issuer', 'title'];

    protected function casts(): array
    {
        return ['issued_on' => 'date', 'sort' => 'integer'];
    }

    protected static function newFactory(): CertificateFactory
    {
        return CertificateFactory::new();
    }
}
