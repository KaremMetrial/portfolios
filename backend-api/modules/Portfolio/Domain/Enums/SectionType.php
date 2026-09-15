<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

/** Case-study section kinds (FR-BE-03). */
enum SectionType: string
{
    case Context = 'context';
    case Role = 'role';
    case Architecture = 'architecture';
    case Flows = 'flows';
    case Challenges = 'challenges';
    case Outcome = 'outcome';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
