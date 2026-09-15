<?php

declare(strict_types=1);

namespace Modules\Portfolio\Domain\Support;

use Illuminate\Database\Eloquent\Model;
use Modules\Governance\Domain\Models\FeatureFlag;
use Modules\Governance\Domain\Models\Setting;
use Modules\Portfolio\Domain\Models\Certificate;
use Modules\Portfolio\Domain\Models\CvFile;
use Modules\Portfolio\Domain\Models\Education;
use Modules\Portfolio\Domain\Models\Experience;
use Modules\Portfolio\Domain\Models\Profile;
use Modules\Portfolio\Domain\Models\Project;
use Modules\Portfolio\Domain\Models\ProjectLink;
use Modules\Portfolio\Domain\Models\ProjectSection;
use Modules\Portfolio\Domain\Models\SeoMeta;
use Modules\Portfolio\Domain\Models\Skill;
use Modules\Portfolio\Domain\Models\SkillGroup;
use Modules\Portfolio\Domain\Models\SlugRedirect;
use Modules\Portfolio\Domain\Models\SocialLink;
use Modules\Portfolio\Domain\Models\Testimonial;

/**
 * The cache-tag contract shared with the frontend (FR-BE-51). The same tags
 * invalidate the API's Redis cache and, from BE-5, the frontend's pages.
 */
final class ContentTags
{
    public const PROFILE = 'profile';

    public const SITE = 'site';

    public const EXPERIENCES = 'experiences';

    public const SKILLS = 'skills';

    public const CREDENTIALS = 'credentials';

    public const PROJECTS = 'projects';

    public const STATS = 'stats';

    public const INSIGHTS = 'insights';

    public const SEO = 'seo';

    public const REDIRECTS = 'redirects';

    public static function project(string $slug): string
    {
        return "project:{$slug}";
    }

    public static function article(string $slug): string
    {
        return "article:{$slug}";
    }

    /** @return list<string> every tag that is not scoped to one item */
    public static function all(): array
    {
        return [
            self::PROFILE, self::SITE, self::EXPERIENCES, self::SKILLS, self::CREDENTIALS,
            self::PROJECTS, self::STATS, self::INSIGHTS, self::SEO, self::REDIRECTS,
        ];
    }

    /**
     * Tags whose content changes when this model is saved or deleted.
     *
     * @return list<string>
     */
    public static function forModel(Model $model): array
    {
        $tags = match (true) {
            $model instanceof Profile, $model instanceof SocialLink => [self::PROFILE, self::SITE],
            $model instanceof Testimonial => [self::PROFILE],
            // Experiences feed the stats (companies, experience since), embedded in /profile.
            $model instanceof Experience => [self::EXPERIENCES, self::STATS, self::PROFILE],
            $model instanceof Project => self::projectTags($model),
            $model instanceof ProjectSection, $model instanceof ProjectLink => self::projectChildTags($model),
            $model instanceof Skill, $model instanceof SkillGroup => [self::SKILLS, self::PROJECTS],
            $model instanceof Education, $model instanceof Certificate => [self::CREDENTIALS],
            $model instanceof SeoMeta => self::seoTags($model),
            $model instanceof SlugRedirect => [self::REDIRECTS],
            $model instanceof CvFile, $model instanceof Setting, $model instanceof FeatureFlag => [self::SITE],
            default => [],
        };

        return array_values(array_unique($tags));
    }

    /** @return list<string> */
    private static function projectTags(Project $project): array
    {
        // Visibility, featured flag, and links change the index, counts, and
        // the experience timeline's project chips.
        $tags = [self::PROJECTS, self::STATS, self::PROFILE, self::SKILLS, self::EXPERIENCES, self::project($project->slug)];

        $original = $project->getOriginal('slug');
        if (is_string($original) && $original !== $project->slug) {
            $tags[] = self::project($original);
            $tags[] = self::REDIRECTS;
        }

        return $tags;
    }

    /** @return list<string> */
    private static function projectChildTags(ProjectSection|ProjectLink $child): array
    {
        $slug = Project::query()->whereKey($child->project_id)->value('slug');
        $tags = [self::PROJECTS];
        if (is_string($slug)) {
            $tags[] = self::project($slug);
        }
        if ($child instanceof ProjectLink) {
            array_push($tags, self::STATS, self::PROFILE);
        }

        return $tags;
    }

    /** @return list<string> */
    private static function seoTags(SeoMeta $meta): array
    {
        $tags = [self::SEO];
        if ($meta->seoable_type === (new Project)->getMorphClass() && $meta->seoable_id !== null) {
            $slug = Project::query()->whereKey($meta->seoable_id)->value('slug');
            if (is_string($slug)) {
                $tags[] = self::project($slug);
                $tags[] = self::PROJECTS;
            }
        }

        return $tags;
    }
}
