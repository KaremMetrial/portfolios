<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Services;

use Modules\Governance\Infrastructure\Services\FeatureFlagService;
use Modules\Governance\Infrastructure\Services\SettingsService;

/**
 * Site-wide settings stored in Governance Settings and Feature Flags
 * (FR-BE-23, FR-BE-24, FR-BE-84), with safe defaults when unset.
 */
final class SiteSettings
{
    /** Section flags exposed on GET /site. */
    public const FLAGS = [
        'showcase.console',
        'showcase.presence',
        'showcase.github',
        'home.skills_constellation',
        'insights',
    ];

    public const ALTERNATE_NAMES = 'person.alternate_names';

    public const SAME_AS = 'person.same_as';

    public const KNOWS_ABOUT = 'person.knows_about';

    public const SEO_DEFAULTS = 'site.seo_defaults';

    public const CONTACT_AUTO_REPLY = 'contact.auto_reply';

    public const NOTIFICATION_EMAIL = 'contact.notification_email';

    public function __construct(
        private readonly SettingsService $settings,
        private readonly FeatureFlagService $flags,
    ) {}

    /** @return array<string, bool> */
    public function flags(): array
    {
        $flags = [];
        foreach (self::FLAGS as $name) {
            $flags[$name] = $this->flags->enabled($name);
        }

        return $flags;
    }

    public function flagEnabled(string $name): bool
    {
        return $this->flags->enabled($name);
    }

    /** @return list<string> */
    public function alternateNames(): array
    {
        return $this->stringList($this->settings->get(self::ALTERNATE_NAMES, [
            'Karem Metrial', 'Kareem Sabry Elsayed', 'كريم صبري',
        ]));
    }

    /** @return list<string> */
    public function sameAs(): array
    {
        return $this->stringList($this->settings->get(self::SAME_AS, []));
    }

    /** @return list<string>|null null means "derive from skills" */
    public function knowsAbout(): ?array
    {
        $value = $this->settings->get(self::KNOWS_ABOUT);

        return is_array($value) && $value !== [] ? $this->stringList($value) : null;
    }

    /** @return array{title: string|null, description: string|null} */
    public function seoDefaults(string $locale): array
    {
        $value = $this->settings->get(self::SEO_DEFAULTS, []);
        $localized = is_array($value) && is_array($value[$locale] ?? null) ? $value[$locale] : [];

        return [
            'title' => is_string($localized['title'] ?? null) ? $localized['title'] : null,
            'description' => is_string($localized['description'] ?? null) ? $localized['description'] : null,
        ];
    }

    public function contactAutoReply(): bool
    {
        return (bool) $this->settings->get(self::CONTACT_AUTO_REPLY, false);
    }

    public function notificationEmail(): ?string
    {
        $value = $this->settings->get(self::NOTIFICATION_EMAIL);
        if (is_string($value) && $value !== '') {
            return $value;
        }
        $fallback = config('portfolio.owner_notification_email');

        return is_string($fallback) && $fallback !== '' ? $fallback : null;
    }

    public function set(string $key, mixed $value): void
    {
        $this->settings->set($key, $value);
    }

    /** @return list<string> */
    private function stringList(mixed $value): array
    {
        return is_array($value) ? array_values(array_filter($value, fn ($item): bool => is_string($item) && $item !== '')) : [];
    }
}
