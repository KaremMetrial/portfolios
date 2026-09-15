<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

enum LinkKind: string
{
    case PlayStore = 'play_store';
    case AppStore = 'app_store';
    case Website = 'website';
    case Github = 'github';
    case Packagist = 'packagist';
    case Demo = 'demo';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /** Store listings count as public apps in the proof stats (FR-BE-07). */
    public function isStore(): bool
    {
        return $this === self::PlayStore || $this === self::AppStore;
    }
}
