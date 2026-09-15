<?php

declare(strict_types=1);

namespace Modules\Territory\Infrastructure\Persistence\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Modules\Shared\Infrastructure\Persistence\BaseRepository;
use Modules\Territory\Domain\Models\City;

/**
 * @extends BaseRepository<City>
 */
class CityRepository extends BaseRepository
{
    public function __construct(City $model)
    {
        parent::__construct($model);
    }

    public function getActiveByGovernorate(string $governorateId, ?string $tenantId = null): Collection
    {
        return $this->query($tenantId)
            ->where('governorate_id', $governorateId)
            ->where('is_active', true)
            ->get();
    }
}
