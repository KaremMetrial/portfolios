<?php

declare(strict_types=1);

namespace Modules\Shared\Infrastructure\Translation\Facades;

use Illuminate\Support\Facades\Facade;
use Modules\Shared\Infrastructure\Translation\TranslationManager;

/**
 * @method static \Modules\Shared\Infrastructure\Translation\FluentTranslator from(string $locale)
 * @method static \Modules\Shared\Infrastructure\Translation\FluentTranslator to(string $locale)
 * @method static array translate(array $values)
 * @method static \Modules\Shared\Infrastructure\Translation\Contracts\TranslationProviderInterface driver(string|null $driver = null)
 *
 * @see TranslationManager
 */
class Translation extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'translation';
    }
}
