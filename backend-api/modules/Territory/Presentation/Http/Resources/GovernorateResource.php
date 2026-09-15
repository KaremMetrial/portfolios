<?php

declare(strict_types=1);

namespace Modules\Territory\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Territory\Domain\Models\Governorate;

/** @mixin Governorate */
class GovernorateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'country_id' => $this->country_id,
            'name' => $this->name,
            'name_translations' => $this->getTranslations('name'),
            'code' => $this->code,
            'is_active' => $this->is_active,
        ];
    }
}
