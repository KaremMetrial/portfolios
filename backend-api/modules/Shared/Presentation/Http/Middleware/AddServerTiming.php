<?php

declare(strict_types=1);

namespace Modules\Shared\Presentation\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Shared\Infrastructure\Observability\ServerTimingRecorder;
use Symfony\Component\HttpFoundation\Response;

/** Server-Timing: app, db, and cache hit/miss for the live console (FR-BE-71). */
final class AddServerTiming
{
    public function __construct(private readonly ServerTimingRecorder $recorder) {}

    public function handle(Request $request, Closure $next): Response
    {
        $this->recorder->start();

        $response = $next($request);
        $response->headers->set('Server-Timing', $this->recorder->header());

        return $response;
    }
}
