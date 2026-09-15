<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

enum RedirectType: string
{
    case Project = 'project';
    case Article = 'article';

    /** Public path prefix of this content type. */
    public function pathPrefix(): string
    {
        return match ($this) {
            self::Project => '/projects/',
            self::Article => '/insights/',
        };
    }
}
