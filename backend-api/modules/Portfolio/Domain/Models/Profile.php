<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Portfolio\Domain\Enums\Availability;
use Modules\Portfolio\Infrastructure\Database\Factories\ProfileFactory;
use Modules\Shared\Infrastructure\Traits\Auditable;
use Modules\Shared\Infrastructure\Traits\HasTranslations;
use Modules\Shared\Infrastructure\Traits\HasUuid;

/**
 * The single owner profile (FR-BE-01).
 *
 * @property string $id
 * @property string $name
 * @property string $headline
 * @property string $summary
 * @property string $about
 * @property string $location
 * @property Availability $availability
 * @property string $availability_text
 * @property bool $open_to_relocation
 * @property string $email
 * @property string|null $phone
 * @property bool $phone_visible
 * @property-read Collection<int, SocialLink> $socialLinks
 */
class Profile extends Model
{
    use Auditable;
    use HasFactory;
    use HasTranslations;
    use HasUuid;

    protected $fillable = [
        'name', 'headline', 'summary', 'about', 'location', 'availability', 'availability_text',
        'open_to_relocation', 'email', 'phone', 'phone_visible',
    ];

    protected array $translatable = ['name', 'headline', 'summary', 'about', 'location', 'availability_text'];

    protected function casts(): array
    {
        return [
            'availability' => Availability::class,
            'open_to_relocation' => 'boolean',
            'phone_visible' => 'boolean',
        ];
    }

    /** @return HasMany<SocialLink, $this> */
    public function socialLinks(): HasMany
    {
        return $this->hasMany(SocialLink::class)->orderBy('sort');
    }

    protected static function newFactory(): ProfileFactory
    {
        return ProfileFactory::new();
    }
}
