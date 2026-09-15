<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

/** Profile availability status (FR-BE-01). */
enum Availability: string
{
    case Open = 'open';
    case OpenToRelocation = 'open_to_relocation';
    case NotAvailable = 'not_available';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
