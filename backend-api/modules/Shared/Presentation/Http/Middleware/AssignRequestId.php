<?php

declare(strict_types=1);

namespace Modules\Shared\Presentation\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Every API response carries X-Request-Id (FR-BE-71). A well-formed incoming
 * id is kept so a trace can span the frontend and the API; anything else is
 * replaced. The envelope's meta.request_id reads the same request header.
 */
final class AssignRequestId
{
    private const HEADER = 'X-Request-Id';

    public function handle(Request $request, Closure $next): Response
    {
        $incoming = $request->headers->get(self::HEADER);
        $id = is_string($incoming) && preg_match('/^[A-Za-z0-9-]{8,64}$/', $incoming) === 1
            ? $incoming
            : str_replace('-', '', (string) Str::uuid());

        $request->headers->set(self::HEADER, $id);

        $response = $next($request);
        $response->headers->set(self::HEADER, $id);

        return $response;
    }
}
