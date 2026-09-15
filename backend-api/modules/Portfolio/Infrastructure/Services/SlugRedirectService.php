<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Services;

use Illuminate\Support\Facades\DB;
use Modules\Portfolio\Domain\Enums\RedirectType;
use Modules\Portfolio\Domain\Models\SlugRedirect;

/** Slug history with collapsed chains (FR-BE-83). */
final class SlugRedirectService
{
    /**
     * Records old → new. Existing redirects that pointed at the old slug are
     * re-pointed (A→B plus B→C becomes A→C and B→C), and a redirect whose
     * source is the new slug is removed because that slug is live again.
     */
    public function record(RedirectType $type, string $oldSlug, string $newSlug): void
    {
        if ($oldSlug === $newSlug) {
            return;
        }

        DB::transaction(function () use ($type, $oldSlug, $newSlug): void {
            SlugRedirect::query()
                ->where('type', $type->value)
                ->where('old_slug', $newSlug)
                ->get()
                ->each->delete();

            SlugRedirect::query()
                ->where('type', $type->value)
                ->where('new_slug', $oldSlug)
                ->get()
                ->each(fn (SlugRedirect $redirect) => $redirect->update(['new_slug' => $newSlug]));

            SlugRedirect::query()->updateOrCreate(
                ['type' => $type->value, 'old_slug' => $oldSlug],
                ['new_slug' => $newSlug],
            );
        });
    }

    /** True when a slug was used before, so it cannot be given to another item. */
    public function isRetired(RedirectType $type, string $slug): bool
    {
        return SlugRedirect::query()->where('type', $type->value)->where('old_slug', $slug)->exists();
    }
}
