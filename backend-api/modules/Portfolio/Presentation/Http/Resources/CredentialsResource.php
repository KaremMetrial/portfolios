<?php

declare(strict_types=1);

namespace Modules\Portfolio\Presentation\Http\Resources;

use Illuminate\Support\Collection;
use Modules\Portfolio\Domain\Models\Certificate;
use Modules\Portfolio\Domain\Models\Education;

final class CredentialsResource
{
    /**
     * @param  Collection<int, Education>  $education
     * @param  Collection<int, Certificate>  $certificates
     * @return array{education: list<array<string, mixed>>, certificates: list<array<string, mixed>>}
     */
    public static function make(Collection $education, Collection $certificates): array
    {
        return [
            'education' => $education->map(fn (Education $item): array => [
                'institution' => $item->institution,
                'degree' => $item->degree,
                'field' => $item->field,
                'started_year' => $item->started_year,
                'ended_year' => $item->ended_year,
                'location' => $item->location,
            ])->values()->all(),
            'certificates' => $certificates->map(fn (Certificate $item): array => [
                'key' => $item->key,
                'title' => $item->title,
                'issuer' => $item->issuer,
                'issued_on' => $item->issued_on?->format('Y-m'),
                'credential_url' => $item->credential_url,
            ])->values()->all(),
        ];
    }
}
