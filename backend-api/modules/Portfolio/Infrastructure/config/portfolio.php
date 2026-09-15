<?php

declare(strict_types=1);

return [

    // Public site origin, used for entity URLs, IndexNow, and CV links.
    'public_site_url' => env('PUBLIC_SITE_URL', 'http://localhost:3000'),

    'owner_notification_email' => env('OWNER_NOTIFICATION_EMAIL'),

    // Public list pagination (SRS-BE §5.1).
    'per_page' => ['default' => 12, 'max' => 50],

    // HTTP caching for public GET responses (FR-BE-12).
    'http_cache' => [
        'max_age' => 60,
        'stale_while_revalidate' => 600,
    ],

];
