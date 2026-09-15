<?php

declare(strict_types=1);

namespace Modules\Integration\Infrastructure\Sms;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Modules\Integration\Domain\Contracts\SmsProvider;

/** Local/dev driver: writes the SMS to the log instead of sending it. */
class LogDriver implements SmsProvider
{
    public function send(string $to, string $message): string
    {
        $id = 'log-'.Str::uuid();

        Log::info('sms.sent', ['id' => $id, 'to' => $to, 'message' => $message]);

        return $id;
    }
}
