<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Enums;

/** Filterable business domain (PR-B1). */
enum ProjectDomain: string
{
    case Delivery = 'delivery';
    case Marketplace = 'marketplace';
    case Ecommerce = 'ecommerce';
    case FieldService = 'field_service';
    case ServiceMarketplace = 'service_marketplace';
    case Booking = 'booking';
    case Elearning = 'elearning';
    case Platform = 'platform';
    case DeveloperTools = 'developer_tools';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
