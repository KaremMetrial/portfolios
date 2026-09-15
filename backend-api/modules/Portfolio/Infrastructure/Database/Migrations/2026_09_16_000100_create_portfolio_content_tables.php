<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Portfolio content (SRS-BE §4). Translatable columns are JSON
 * {"en": "…", "ar": "…"}; enums are strings validated by PHP backed enums.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->json('name');
            $table->json('headline');
            $table->json('summary');
            $table->json('about');
            $table->json('location');
            $table->string('availability', 32);
            $table->json('availability_text');
            $table->boolean('open_to_relocation')->default(false);
            $table->string('email');
            $table->string('phone', 32)->nullable();
            $table->boolean('phone_visible')->default(false);
            $table->timestamps();
        });

        Schema::create('social_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->constrained('profiles')->cascadeOnDelete();
            $table->string('platform', 32);
            $table->string('url');
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();

            $table->unique(['profile_id', 'platform']);
        });

        Schema::create('experiences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('company');
            $table->string('company_url')->nullable();
            $table->json('role');
            $table->string('employment_type', 32);
            $table->json('location');
            $table->date('started_on');
            $table->date('ended_on')->nullable();
            $table->json('highlights');
            $table->unsignedSmallInteger('sort')->default(0)->index();
            $table->timestamps();

            $table->unique(['company', 'started_on']);
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->json('title');
            $table->json('tagline');
            $table->json('summary');
            $table->string('domain', 32)->index();
            $table->string('type', 32);
            $table->json('role');
            $table->date('started_on')->nullable();
            $table->date('ended_on')->nullable();
            $table->string('status', 16)->default('draft');
            $table->string('confidentiality', 16)->default('public');
            $table->boolean('is_featured')->default(false);
            $table->unsignedSmallInteger('sort')->default(0);
            $table->json('architecture')->nullable();
            $table->json('flow')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'confidentiality', 'sort']);
        });

        Schema::create('project_sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('type', 32);
            $table->json('heading');
            $table->json('body');
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();

            $table->unique(['project_id', 'type']);
        });

        Schema::create('project_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('kind', 32);
            $table->string('url');
            $table->json('label');
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();

            $table->unique(['project_id', 'url']);
        });

        Schema::create('experience_project', function (Blueprint $table) {
            $table->foreignUuid('experience_id')->constrained('experiences')->cascadeOnDelete();
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->primary(['experience_id', 'project_id']);
        });

        Schema::create('skill_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique();
            $table->json('name');
            $table->string('icon', 64)->nullable();
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('skill_group_id')->constrained('skill_groups')->cascadeOnDelete();
            $table->string('key')->unique();
            $table->json('name');
            $table->string('icon', 64)->nullable();
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('project_skill', function (Blueprint $table) {
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignUuid('skill_id')->constrained('skills')->cascadeOnDelete();
            $table->unsignedSmallInteger('sort')->default(0);
            $table->primary(['project_id', 'skill_id']);
        });

        Schema::create('education', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->json('institution');
            $table->json('degree');
            $table->json('field');
            $table->unsignedSmallInteger('started_year');
            $table->unsignedSmallInteger('ended_year')->nullable();
            $table->json('location');
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('certificates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique();
            $table->json('issuer');
            $table->json('title');
            $table->date('issued_on')->nullable();
            $table->string('credential_url')->nullable();
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('author');
            $table->json('role');
            $table->string('company')->nullable();
            $table->json('quote');
            $table->boolean('consent_given')->default(false);
            $table->boolean('is_published')->default(false);
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('cv_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('locale', 5);
            $table->foreignUuid('media_id')->constrained('media')->cascadeOnDelete();
            $table->boolean('is_current')->default(false);
            $table->timestamp('uploaded_at');
            $table->timestamps();

            $table->index(['locale', 'is_current']);
        });
    }

    public function down(): void
    {
        foreach ([
            'cv_files', 'testimonials', 'certificates', 'education', 'project_skill', 'skills',
            'skill_groups', 'experience_project', 'project_links', 'project_sections', 'projects',
            'experiences', 'social_links', 'profiles',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
