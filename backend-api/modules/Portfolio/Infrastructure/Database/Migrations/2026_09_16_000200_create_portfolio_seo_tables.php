<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** SEO fields and slug history (FR-BE-82, FR-BE-83). */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_meta', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // Either a model (project, article) or a static page key.
            $table->nullableUuidMorphs('seoable');
            $table->string('page_key', 32)->nullable()->unique();
            $table->json('title')->nullable();
            $table->json('description')->nullable();
            $table->foreignUuid('og_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->boolean('noindex')->default(false);
            $table->timestamps();

            $table->unique(['seoable_type', 'seoable_id']);
        });

        Schema::create('slug_redirects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type', 16);
            $table->string('old_slug');
            $table->string('new_slug');
            $table->timestamps();

            $table->unique(['type', 'old_slug']);
            $table->index(['type', 'new_slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('slug_redirects');
        Schema::dropIfExists('seo_meta');
    }
};
