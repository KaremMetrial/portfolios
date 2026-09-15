<?php

declare(strict_types=1);

namespace Modules\Media\Domain\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Modules\Media\Domain\Models\Media;

class MediaVerified
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public readonly Media $media) {}
}
