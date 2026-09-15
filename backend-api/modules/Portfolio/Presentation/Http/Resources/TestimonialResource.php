<?php

declare(strict_types=1);

namespace Modules\Portfolio\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Portfolio\Domain\Models\Testimonial;

/** @mixin Testimonial */
final class TestimonialResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        /** @var Testimonial $testimonial */
        $testimonial = $this->resource;

        return [
            'id' => $testimonial->id,
            'author' => $testimonial->author,
            'role' => $testimonial->role,
            'company' => $testimonial->company,
            'quote' => $testimonial->quote,
        ];
    }
}
