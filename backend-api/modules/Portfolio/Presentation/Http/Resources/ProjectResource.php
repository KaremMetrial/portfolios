<?php

declare(strict_types=1);

namespace Modules\Portfolio\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Media\Domain\Enums\MediaType;
use Modules\Media\Domain\Models\Media;
use Modules\Portfolio\Domain\Models\Project;
use Modules\Portfolio\Domain\Models\ProjectLink;
use Modules\Portfolio\Domain\Models\ProjectSection;
use Modules\Portfolio\Domain\Models\Skill;
use Modules\Portfolio\Infrastructure\Services\PublicMediaPresenter;

/**
 * Project in three shapes: `card` (index), `full` (case study), and
 * `summary` for summary_only projects, which never carries sections, links,
 * media, or diagrams (FR-BE-04).
 *
 * @mixin Project
 */
final class ProjectResource extends JsonResource
{
    private string $variant = 'full';

    public static function card(Project $project): self
    {
        $resource = new self($project);
        $resource->variant = 'card';

        return $resource;
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        /** @var Project $project */
        $project = $this->resource;

        $base = [
            'slug' => $project->slug,
            'title' => $project->title,
            'tagline' => $project->tagline,
            'summary' => $project->summary,
            'domain' => $project->domain->value,
            'type' => $project->type->value,
            'confidentiality' => $project->confidentiality->value,
            'is_featured' => $project->is_featured,
            'period' => [
                'started_on' => $project->started_on?->format('Y-m'),
                'ended_on' => $project->ended_on?->format('Y-m'),
            ],
            'technologies' => $project->skills->map(fn (Skill $skill): array => [
                'key' => $skill->key,
                'name' => $skill->name,
                'group' => $skill->group->key,
            ])->values()->all(),
            'updated_at' => $project->updated_at?->toIso8601String(),
        ];

        if ($this->variant === 'card') {
            return $base + ['cover' => $project->isSummaryOnly() ? null : $this->cover($project)];
        }

        $base['seo'] = SeoResource::make($project->seo);

        if ($project->isSummaryOnly()) {
            return $base;
        }

        return $base + [
            'role' => $project->role,
            'sections' => $project->sections->map(fn (ProjectSection $section): array => [
                'type' => $section->type->value,
                'heading' => $section->heading,
                // Raw Markdown; the frontend sanitizes when rendering (NFR-S6).
                'body_markdown' => $section->body,
            ])->values()->all(),
            'links' => $project->links->map(fn (ProjectLink $link): array => [
                'kind' => $link->kind->value,
                'url' => $link->url,
                'label' => $link->label,
            ])->values()->all(),
            'media' => app(PublicMediaPresenter::class)->presentMany($project->media),
            'architecture' => $project->architecture,
            'flow' => $project->flow,
        ];
    }

    /** @return array<string, mixed>|null */
    private function cover(Project $project): ?array
    {
        $presenter = app(PublicMediaPresenter::class);
        $images = $presenter->presentMany($project->media->filter(fn (Media $media): bool => $media->media_type === MediaType::Image));

        return $images[0] ?? null;
    }
}
