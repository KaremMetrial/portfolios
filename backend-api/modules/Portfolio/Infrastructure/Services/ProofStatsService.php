<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Services;

use Modules\Portfolio\Domain\Enums\EmploymentType;
use Modules\Portfolio\Domain\Enums\LinkKind;
use Modules\Portfolio\Domain\Models\Experience;
use Modules\Portfolio\Domain\Models\Project;
use Modules\Portfolio\Domain\Models\ProjectLink;

/**
 * Proof stats computed from stored content only (FR-BE-07, PR-A4).
 * Nothing here is typed in by hand, so the numbers can never drift from
 * the case studies and timeline they summarize.
 */
final class ProofStatsService
{
    /**
     * @return array{
     *     shipped_platforms: int,
     *     companies: int,
     *     public_apps: int,
     *     experience_since: string|null
     * }
     */
    public function compute(): array
    {
        return [
            'shipped_platforms' => Project::query()->publiclyVisible()->count(),
            'companies' => $this->companies(),
            'public_apps' => $this->publicApps(),
            'experience_since' => $this->experienceSince(),
        ];
    }

    /** Distinct employers; internships and training programs do not count. */
    private function companies(): int
    {
        return Experience::query()
            ->where('employment_type', '!=', EmploymentType::Internship->value)
            ->distinct()
            ->count('company');
    }

    /** Distinct store listings on publicly visible projects. */
    private function publicApps(): int
    {
        return ProjectLink::query()
            ->whereIn('kind', [LinkKind::PlayStore->value, LinkKind::AppStore->value])
            ->whereIn('project_id', Project::query()->publiclyVisible()->select('id'))
            ->distinct()
            ->count('url');
    }

    /** Year and month of the earliest professional (non-internship) role, e.g. "2025-01". */
    private function experienceSince(): ?string
    {
        $earliest = Experience::query()
            ->where('employment_type', '!=', EmploymentType::Internship->value)
            ->orderBy('started_on')
            ->first();

        return $earliest?->started_on->format('Y-m');
    }
}
