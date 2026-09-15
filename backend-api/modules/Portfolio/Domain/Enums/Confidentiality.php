<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

/** Project visibility level (FR-BE-04). */
enum Confidentiality: string
{
    case Public = 'public';
    case SummaryOnly = 'summary_only';
    case Hidden = 'hidden';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
