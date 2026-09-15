<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Modules\Portfolio\Domain\Support\ContentTags;
use Modules\Portfolio\Infrastructure\Services\PublicCache;

/** Flushes the public cache tags of any content model that changes (FR-BE-11). */
final class ContentCacheObserver
{
    public function __construct(private readonly PublicCache $cache) {}

    public function saved(Model $model): void
    {
        $this->flush($model);
    }

    public function deleted(Model $model): void
    {
        $this->flush($model);
    }

    private function flush(Model $model): void
    {
        // Tags are computed now (the original slug is still known) and
        // flushed after commit, so a rolled-back write leaves the cache alone.
        $tags = ContentTags::forModel($model);
        DB::afterCommit(fn () => $this->cache->flush($tags));
    }
}
