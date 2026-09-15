<?php

declare(strict_types=1);

namespace Tests\Feature\Portfolio;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Governance\Domain\Models\AuditLog;
use Modules\Portfolio\Domain\Enums\Confidentiality;
use Modules\Portfolio\Domain\Enums\LinkKind;
use Modules\Portfolio\Domain\Models\Certificate;
use Modules\Portfolio\Domain\Models\Education;
use Modules\Portfolio\Domain\Models\Experience;
use Modules\Portfolio\Domain\Models\Profile;
use Modules\Portfolio\Domain\Models\Project;
use Modules\Portfolio\Domain\Models\ProjectLink;
use Modules\Portfolio\Domain\Models\ProjectSection;
use Modules\Portfolio\Domain\Models\Skill;
use Modules\Portfolio\Domain\Models\SkillGroup;
use Modules\Portfolio\Domain\Models\SocialLink;
use Modules\Portfolio\Domain\Models\Testimonial;
use Modules\Portfolio\Infrastructure\Database\Seeders\PortfolioContentSeeder;
use Modules\Portfolio\Infrastructure\Services\ProofStatsService;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PortfolioDomainTest extends TestCase
{
    use RefreshDatabase;

    /** @return array<string, array{0: string, 1: string, 2: bool}> */
    public static function confidentialityMatrix(): array
    {
        return [
            'published public' => ['published', 'public', true],
            'published summary_only' => ['published', 'summary_only', true],
            'published hidden' => ['published', 'hidden', false],
            'draft public' => ['draft', 'public', false],
            'draft summary_only' => ['draft', 'summary_only', false],
            'draft hidden' => ['draft', 'hidden', false],
        ];
    }

    #[DataProvider('confidentialityMatrix')]
    public function test_publicly_visible_scope_implements_confidentiality(string $status, string $confidentiality, bool $visible): void
    {
        $project = Project::factory()->create(['status' => $status, 'confidentiality' => $confidentiality]);

        $this->assertSame($visible, Project::query()->publiclyVisible()->whereKey($project->id)->exists());
        $this->assertSame($visible, $project->isPubliclyVisible());
    }

    public function test_translatable_fields_resolve_per_locale_with_english_fallback(): void
    {
        $project = Project::factory()->create([
            'title' => ['en' => 'Delivery platform', 'ar' => 'منصة توصيل'],
            'tagline' => ['en' => 'English only'],
        ]);

        app()->setLocale('ar');
        $this->assertSame('منصة توصيل', $project->title);
        $this->assertSame('English only', $project->tagline);

        app()->setLocale('en');
        $this->assertSame('Delivery platform', $project->title);
    }

    public function test_proof_stats_are_computed_from_content_only(): void
    {
        Experience::factory()->create(['company' => 'Acme', 'started_on' => '2025-03-01', 'ended_on' => '2025-09-01']);
        Experience::factory()->create(['company' => 'Acme', 'started_on' => '2026-01-01']);
        Experience::factory()->create(['company' => 'Globex', 'started_on' => '2025-01-01']);
        Experience::factory()->internship()->create(['company' => 'Bootcamp', 'started_on' => '2024-04-01']);

        $public = Project::factory()->create();
        ProjectLink::factory()->playStore()->for($public)->create();
        ProjectLink::factory()->for($public)->create(['kind' => LinkKind::AppStore, 'url' => 'https://apps.apple.com/app/id1']);
        ProjectLink::factory()->for($public)->create(['kind' => LinkKind::Website]);

        $summaryOnly = Project::factory()->summaryOnly()->create();
        ProjectLink::factory()->playStore()->for($summaryOnly)->create();

        $hidden = Project::factory()->hidden()->create();
        ProjectLink::factory()->playStore()->for($hidden)->create();
        Project::factory()->draft()->create();

        $this->assertSame([
            'shipped_platforms' => 2,
            'companies' => 2,
            'public_apps' => 3,
            'experience_since' => '2025-01',
        ], app(ProofStatsService::class)->compute());
    }

    public function test_proof_stats_handle_empty_content(): void
    {
        $this->assertSame([
            'shipped_platforms' => 0,
            'companies' => 0,
            'public_apps' => 0,
            'experience_since' => null,
        ], app(ProofStatsService::class)->compute());
    }

    public function test_editing_a_section_touches_the_project(): void
    {
        $project = Project::factory()->create(['updated_at' => now()->subDay()]);
        $section = ProjectSection::factory()->for($project)->create();
        $before = $project->fresh()?->updated_at;

        $this->travel(5)->minutes();
        $section->update(['heading' => ['en' => 'Changed']]);

        $this->assertTrue($project->fresh()?->updated_at?->greaterThan($before));
    }

    public function test_content_changes_are_audited(): void
    {
        $project = Project::factory()->create();
        $project->update(['is_featured' => true]);

        $this->assertTrue(
            AuditLog::query()->where('auditable_type', $project->getMorphClass())->where('auditable_id', $project->id)->exists()
        );
    }

    public function test_testimonials_require_publish_and_consent(): void
    {
        Testimonial::factory()->create(['author' => 'Shown']);
        Testimonial::factory()->create(['author' => 'No consent', 'consent_given' => false]);
        Testimonial::factory()->create(['author' => 'Unpublished', 'is_published' => false]);

        $this->assertSame(['Shown'], Testimonial::query()->publiclyVisible()->pluck('author')->all());
    }

    public function test_seeder_loads_cv_content_and_is_idempotent(): void
    {
        $this->seed(PortfolioContentSeeder::class);
        $counts = $this->contentCounts();

        $this->seed(PortfolioContentSeeder::class);
        $this->assertSame($counts, $this->contentCounts());

        $this->assertSame(1, $counts['profiles']);
        $this->assertSame(4, $counts['experiences']);
        $this->assertSame(7, $counts['skill_groups']);
        $this->assertSame(3, $counts['certificates']);
        $this->assertSame(1, $counts['education']);
        $this->assertSame(7, $counts['projects']);

        $this->assertSame(Confidentiality::SummaryOnly, Project::query()->where('slug', 'field-service-platform')->firstOrFail()->confidentiality);
        $this->assertFalse((bool) Profile::query()->value('phone_visible'));
        $this->assertSame(
            ['shipped_platforms' => 7, 'companies' => 3, 'public_apps' => 5, 'experience_since' => '2025-01'],
            app(ProofStatsService::class)->compute(),
        );
    }

    public function test_seeder_never_overwrites_owner_edits(): void
    {
        $this->seed(PortfolioContentSeeder::class);
        Project::query()->where('slug', 'sharwa')->firstOrFail()->update(['title' => ['en' => 'Edited by owner']]);

        $this->seed(PortfolioContentSeeder::class);

        $this->assertSame('Edited by owner', Project::query()->where('slug', 'sharwa')->firstOrFail()->title);
    }

    public function test_every_seeded_translatable_field_has_arabic(): void
    {
        $this->seed(PortfolioContentSeeder::class);

        foreach ([Project::class => ['title', 'tagline', 'summary', 'role'], Experience::class => ['role', 'highlights'], Skill::class => ['name'], SkillGroup::class => ['name']] as $model => $fields) {
            foreach ($model::query()->get() as $row) {
                foreach ($fields as $field) {
                    $this->assertNotEmpty($row->getTranslation($field, 'ar', false), "{$model}#{$row->getKey()} {$field} missing Arabic");
                }
            }
        }
    }

    /** @return array<string, int> */
    private function contentCounts(): array
    {
        return [
            'profiles' => Profile::query()->count(),
            'social_links' => SocialLink::query()->count(),
            'experiences' => Experience::query()->count(),
            'projects' => Project::query()->count(),
            'sections' => ProjectSection::query()->count(),
            'links' => ProjectLink::query()->count(),
            'skill_groups' => SkillGroup::query()->count(),
            'skills' => Skill::query()->count(),
            'education' => Education::query()->count(),
            'certificates' => Certificate::query()->count(),
        ];
    }
}
