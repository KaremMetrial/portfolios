<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Observers;

use Modules\Portfolio\Domain\Enums\RedirectType;
use Modules\Portfolio\Domain\Models\Project;
use Modules\Portfolio\Infrastructure\Services\SlugRedirectService;

/** Renaming a project slug keeps the old URL alive as a 301 (FR-BE-83). */
final class ProjectSlugObserver
{
    public function __construct(private readonly SlugRedirectService $redirects) {}

    public function updated(Project $project): void
    {
        if (! $project->wasChanged('slug')) {
            return;
        }

        $old = $project->getOriginal('slug');
        if (is_string($old)) {
            $this->redirects->record(RedirectType::Project, $old, $project->slug);
        }
    }
}
