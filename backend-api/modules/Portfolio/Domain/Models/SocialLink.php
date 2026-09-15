<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Portfolio\Domain\Enums\SocialPlatform;
use Modules\Portfolio\Infrastructure\Database\Factories\SocialLinkFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * @property string $id
 * @property string $profile_id
 * @property SocialPlatform $platform
 * @property string $url
 * @property int $sort
 */
class SocialLink extends Model
{
    use Auditable;
    use HasFactory;
    use HasUuid;

    protected $fillable = ['profile_id', 'platform', 'url', 'sort'];

    /** @var list<string> */
    protected $touches = ['profile'];

    protected function casts(): array
    {
        return ['platform' => SocialPlatform::class, 'sort' => 'integer'];
    }

    /** @return BelongsTo<Profile, $this> */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    protected static function newFactory(): SocialLinkFactory
    {
        return SocialLinkFactory::new();
    }
}
