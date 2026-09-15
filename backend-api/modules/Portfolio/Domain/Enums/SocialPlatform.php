<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

enum SocialPlatform: string
{
    case Linkedin = 'linkedin';
    case Github = 'github';
    case Packagist = 'packagist';
    case X = 'x';
    case Email = 'email';
    case Website = 'website';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
