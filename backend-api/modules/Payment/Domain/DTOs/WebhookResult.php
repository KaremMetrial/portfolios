<?php

declare(strict_types=1);

namespace Modules\Payment\Domain\DTOs;

use Modules\Payment\Domain\Enums\PaymentStatus;
use Modules\Shared\Application\Abstracts\DataTransferObject;

/**
 * Normalised view of an incoming gateway webhook after verification.
 * gatewayReference matches payments.gateway_reference; extra holds any
 * provider identifiers worth persisting (e.g. Paymob transaction id).
 */
final class WebhookResult extends DataTransferObject
{
    public function __construct(
        public readonly string $gatewayReference,
        public readonly PaymentStatus $status,
        public readonly array $extra = [],
        public readonly array $raw = [],
    ) {}
}
