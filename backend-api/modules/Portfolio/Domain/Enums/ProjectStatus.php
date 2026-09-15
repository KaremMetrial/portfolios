<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

enum ProjectStatus: string
{
    case Draft = 'draft';
    case Published = 'published';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
