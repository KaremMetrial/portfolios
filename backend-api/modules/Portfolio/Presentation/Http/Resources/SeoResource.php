<?php

declare(strict_types=1);

namespace Modules\Portfolio\Presentation\Http\Resources;

use Modules\Portfolio\Domain\Models\SeoMeta;
use Modules\Portfolio\Infrastructure\Services\PublicMediaPresenter;

/**
 * The `seo` block (FR-BE-82). No English fallback: an empty Arabic title is
 * null so the frontend renders its Arabic template instead of English text.
 */
final class SeoResource
{
    /** @return array{title: string|null, description: string|null, og_image: string|null, noindex: bool} */
    public static function make(?SeoMeta $meta): array
    {
        if ($meta === null) {
            return ['title' => null, 'description' => null, 'og_image' => null, 'noindex' => false];
        }

        $locale = app()->getLocale();
        $presenter = app(PublicMediaPresenter::class);
        $og = $meta->ogMedia;

        return [
            'title' => self::text($meta->getTranslation('title', $locale, false)),
            'description' => self::text($meta->getTranslation('description', $locale, false)),
            'og_image' => $og !== null && $presenter->isPresentable($og) ? $presenter->present($og)['variants']['full'] : null,
            'noindex' => $meta->noindex,
        ];
    }

    private static function text(mixed $value): ?string
    {
        return is_string($value) && $value !== '' ? $value : null;
    }
}
