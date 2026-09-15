<?php

declare(strict_types=1);

namespace Modules\Shared\Infrastructure\Observability;

/**
 * Collects per-request timings for the Server-Timing header (FR-BE-71).
 * Reset at the start of every request by AddServerTiming.
 */
final class ServerTimingRecorder
{
    private float $startedAt;

    private float $dbMilliseconds = 0.0;

    private int $queries = 0;

    /** @var 'hit'|'miss'|null */
    private ?string $cache = null;

    public function __construct()
    {
        $this->startedAt = microtime(true);
    }

    public function start(): void
    {
        $this->startedAt = microtime(true);
        $this->dbMilliseconds = 0.0;
        $this->queries = 0;
        $this->cache = null;
    }

    public function recordQuery(float $milliseconds): void
    {
        $this->dbMilliseconds += $milliseconds;
        $this->queries++;
    }

    /** A miss anywhere in the request marks the whole response as a miss. */
    public function recordCache(bool $hit): void
    {
        $this->cache = ($this->cache === 'miss' || ! $hit) ? 'miss' : 'hit';
    }

    public function queryCount(): int
    {
        return $this->queries;
    }

    public function header(): string
    {
        $parts = [
            sprintf('app;dur=%.1f', (microtime(true) - $this->startedAt) * 1000),
            sprintf('db;dur=%.1f', $this->dbMilliseconds),
        ];

        if ($this->cache !== null) {
            $parts[] = 'cache;desc='.$this->cache;
        }

        return implode(', ', $parts);
    }
}
