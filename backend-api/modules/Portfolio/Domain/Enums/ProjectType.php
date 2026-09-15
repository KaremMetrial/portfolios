<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

enum ProjectType: string
{
    case Company = 'company';
    case Freelance = 'freelance';
    case Personal = 'personal';
    case OpenSource = 'open_source';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
