<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Services;

use Closure;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Modules\Shared\Infrastructure\Observability\ServerTimingRecorder;
use Throwable;

/**
 * Redis cache for public read responses, per resource and locale, with
 * tag-based invalidation (FR-BE-11). Keys look like
 * `portfolio:{resource}:{locale}:{hash(params)}`.
 *
 * Stores without tag support (file, database) are bypassed rather than
 * cached without a way to invalidate.
 */
final class PublicCache
{
    private const TTL_SECONDS = 86_400;

    public function __construct(private readonly ServerTimingRecorder $timing) {}

    /**
     * @template T
     *
     * @param  list<string>  $tags
     * @param  array<string, mixed>  $params
     * @param  Closure(): T  $resolve
     * @return T
     */
    public function remember(string $resource, array $tags, array $params, Closure $resolve): mixed
    {
        $store = $this->taggedStore($tags);
        if ($store === null) {
            $this->timing->recordCache(false);

            return $resolve();
        }

        $key = $this->key($resource, $params);
        $hit = true;
        $value = $store->remember($key, self::TTL_SECONDS, function () use ($resolve, &$hit) {
            $hit = false;

            return $resolve();
        });
        $this->timing->recordCache($hit);

        return $value;
    }

    /** @param list<string> $tags */
    public function flush(array $tags): void
    {
        if ($tags === [] || ! $this->supportsTags()) {
            return;
        }

        try {
            Cache::tags($this->prefixed($tags))->flush();
        } catch (Throwable $e) {
            // A stale entry expires by TTL; never fail the write that triggered this.
            Log::warning('portfolio.cache_flush_failed', ['tags' => $tags, 'error' => $e->getMessage()]);
        }
    }

    /** @param array<string, mixed> $params */
    public function key(string $resource, array $params = []): string
    {
        ksort($params);

        return sprintf('portfolio:%s:%s:%s', $resource, app()->getLocale(), md5((string) json_encode($params)));
    }

    /** @param list<string> $tags */
    private function taggedStore(array $tags): ?Repository
    {
        if (! $this->supportsTags()) {
            return null;
        }

        return Cache::tags($this->prefixed($tags));
    }

    private function supportsTags(): bool
    {
        return method_exists(Cache::store()->getStore(), 'tags');
    }

    /**
     * @param  list<string>  $tags
     * @return list<string>
     */
    private function prefixed(array $tags): array
    {
        return array_map(fn (string $tag): string => 'portfolio:'.$tag, $tags);
    }
}
