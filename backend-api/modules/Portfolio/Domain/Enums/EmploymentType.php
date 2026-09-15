<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

enum EmploymentType: string
{
    case FullTime = 'full_time';
    case Internship = 'internship';
    case Contract = 'contract';
    case Freelance = 'freelance';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
