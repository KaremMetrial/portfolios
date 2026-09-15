<?php

declare(strict_types=1);

namespace Modules\Portfolio\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Portfolio\Domain\Models\Skill;
use Modules\Portfolio\Domain\Models\SkillGroup;

/** @mixin SkillGroup */
final class SkillGroupResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        /** @var SkillGroup $group */
        $group = $this->resource;

        return [
            'key' => $group->key,
            'name' => $group->name,
            'icon' => $group->icon,
            'skills' => $group->skills->map(fn (Skill $skill): array => [
                'key' => $skill->key,
                'name' => $skill->name,
                'icon' => $skill->icon,
                // Published, non-hidden projects only (FR-BE-05).
                'project_count' => (int) ($skill->public_projects_count ?? 0),
            ])->values()->all(),
        ];
    }
}
