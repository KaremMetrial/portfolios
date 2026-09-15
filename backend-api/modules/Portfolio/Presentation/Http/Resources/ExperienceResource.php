<?php

declare(strict_types=1);

namespace Modules\Portfolio\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Portfolio\Domain\Models\Experience;
use Modules\Portfolio\Domain\Models\Project;

/** @mixin Experience */
final class ExperienceResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        /** @var Experience $experience */
        $experience = $this->resource;
        $highlights = $experience->highlights;

        return [
            'id' => $experience->id,
            'company' => $experience->company,
            'company_url' => $experience->company_url,
            'role' => $experience->role,
            'employment_type' => $experience->employment_type->value,
            'location' => $experience->location,
            'started_on' => $experience->started_on->format('Y-m'),
            'ended_on' => $experience->ended_on?->format('Y-m'),
            'is_current' => $experience->isCurrent(),
            'highlights' => is_array($highlights) ? array_values($highlights) : [],
            // Only projects a visitor may open (FR-BE-04).
            'projects' => $experience->projects
                ->filter(fn (Project $project): bool => $project->isPubliclyVisible())
                ->sortBy('sort')
                ->map(fn (Project $project): array => ['slug' => $project->slug, 'title' => $project->title])
                ->values()
                ->all(),
        ];
    }
}
