<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Modules\Media\Domain\Enums\MediaStatus;
use Modules\Media\Domain\Enums\MediaVariantType;
use Modules\Media\Domain\Models\Media;
use Modules\Media\Domain\Models\MediaVariant;

/**
 * Serializes public, active media with stable URLs that are safe to cache
 * (no expiring signatures). Private or unverified media is never exposed.
 */
final class PublicMediaPresenter
{
    /** Public variant names mapped to the Media module's variant types. */
    private const VARIANTS = [
        'thumbnail' => MediaVariantType::Thumbnail,
        'card' => MediaVariantType::Medium,
        'full' => MediaVariantType::Large,
        'webp' => MediaVariantType::Webp,
    ];

    public function isPresentable(Media $media): bool
    {
        return $media->is_public && $media->status === MediaStatus::Active && $media->blob !== null;
    }

    /**
     * @param  Collection<int, Media>  $media
     * @return list<array<string, mixed>>
     */
    public function presentMany(Collection $media): array
    {
        return $media
            ->filter(fn (Media $item): bool => $this->isPresentable($item))
            ->sortBy(fn (Media $item): int => (int) ($item->custom_properties['sort'] ?? 0))
            ->map(fn (Media $item): array => $this->present($item))
            ->values()
            ->all();
    }

    /** @return array<string, mixed> */
    public function present(Media $media): array
    {
        $properties = $media->custom_properties;
        $blob = $media->blob;

        /** @var Collection<int, MediaVariant> $variants */
        $variants = $media->variants;
        $urls = ['original' => $blob !== null ? $this->url($blob->disk, $blob->path) : null];
        foreach (self::VARIANTS as $name => $type) {
            $variant = $variants->first(fn (MediaVariant $v): bool => $v->variant === $type);
            $urls[$name] = $variant !== null ? $this->url((string) $variant->disk, (string) $variant->path) : $urls['original'];
        }

        $original = $variants->first(fn (MediaVariant $v): bool => $v->variant === MediaVariantType::Original);

        return [
            'id' => $media->id,
            'type' => $media->media_type->value,
            'alt' => $this->localized($properties['alt'] ?? null),
            'caption' => $this->localized($properties['caption'] ?? null),
            'width' => $original?->width ?? (isset($properties['width']) ? (int) $properties['width'] : null),
            'height' => $original?->height ?? (isset($properties['height']) ? (int) $properties['height'] : null),
            'variants' => $urls,
        ];
    }

    public function url(string $disk, string $path): string
    {
        $url = Storage::disk($disk)->url($path);
        $cdn = config('media.cdn_url');

        return is_string($cdn) && $cdn !== '' ? str_replace(url('/'), rtrim($cdn, '/'), $url) : $url;
    }

    private function localized(mixed $value): ?string
    {
        if (is_string($value)) {
            return $value;
        }
        if (! is_array($value)) {
            return null;
        }
        $locale = app()->getLocale();
        $text = $value[$locale] ?? $value['en'] ?? null;

        return is_string($text) && $text !== '' ? $text : null;
    }
}
