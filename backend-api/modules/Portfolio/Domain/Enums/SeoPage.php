<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

/** Static pages with owner-editable SEO fields (FR-BE-82). */
enum SeoPage: string
{
    case Home = 'home';
    case About = 'about';
    case Projects = 'projects';
    case Experience = 'experience';
    case Contact = 'contact';
    case UnderTheHood = 'under-the-hood';
    case Insights = 'insights';

    /** Public path without a locale prefix. */
    public function path(): string
    {
        return $this === self::Home ? '/' : '/'.$this->value;
    }
}
