<?php

declare(strict_types=1);

namespace Modules\Portfolio\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Portfolio\Domain\Models\Profile;
use Modules\Portfolio\Domain\Models\SocialLink;

/** @mixin Profile */
final class ProfileResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        /** @var Profile $profile */
        $profile = $this->resource;

        return [
            'name' => $profile->name,
            'headline' => $profile->headline,
            'summary' => $profile->summary,
            'about' => $profile->about,
            'location' => $profile->location,
            'availability' => [
                'status' => $profile->availability->value,
                'text' => $profile->availability_text,
                'open_to_relocation' => $profile->open_to_relocation,
            ],
            'email' => $profile->email,
            // NFR-PR2: never exposed unless the owner turns it on.
            'phone' => $profile->phone_visible ? $profile->phone : null,
            'social_links' => $profile->socialLinks->map(fn (SocialLink $link): array => [
                'platform' => $link->platform->value,
                'url' => $link->url,
            ])->values()->all(),
        ];
    }
}
