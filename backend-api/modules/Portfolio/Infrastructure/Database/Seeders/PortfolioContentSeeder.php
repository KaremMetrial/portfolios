<?php

declare(strict_types=1);

namespace Modules\Portfolio\Infrastructure\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Modules\Portfolio\Domain\Enums\Availability;
use Modules\Portfolio\Domain\Enums\Confidentiality;
use Modules\Portfolio\Domain\Enums\EmploymentType;
use Modules\Portfolio\Domain\Enums\LinkKind;
use Modules\Portfolio\Domain\Enums\ProjectDomain;
use Modules\Portfolio\Domain\Enums\ProjectStatus;
use Modules\Portfolio\Domain\Enums\ProjectType;
use Modules\Portfolio\Domain\Enums\SectionType;
use Modules\Portfolio\Domain\Enums\SocialPlatform;
use Modules\Portfolio\Domain\Models\Certificate;
use Modules\Portfolio\Domain\Models\Education;
use Modules\Portfolio\Domain\Models\Experience;
use Modules\Portfolio\Domain\Models\Profile;
use Modules\Portfolio\Domain\Models\Project;
use Modules\Portfolio\Domain\Models\Skill;
use Modules\Portfolio\Domain\Models\SkillGroup;

/**
 * Initial content from the CV (PRD §7, FR-BE-09).
 *
 * Idempotent and non-destructive: rows are matched on natural keys and only
 * created when missing, so re-running never overwrites edits made in the
 * admin. Arabic copy is an AI-assisted draft for owner approval (decision Q-7).
 *
 * Owner to verify before launch: name spelling (Q-1), project confidentiality
 * and store links (Q-2), "Moyasar" spelling (Q-8), the RBAC package (Q-13),
 * and the Waitbuzz ↔ project links (inferred from the com.wb.* package ids).
 */
class PortfolioContentSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $this->seedProfile();
            $skills = $this->seedSkills();
            $projects = $this->seedProjects($skills);
            $this->seedExperiences($projects);
            $this->seedEducation();
            $this->seedCertificates();
        });
    }

    private function seedProfile(): void
    {
        $profile = Profile::query()->first() ?? Profile::query()->create([
            'name' => ['en' => 'Kareem Sabry', 'ar' => 'كريم صبري'],
            'headline' => [
                'en' => 'Backend Software Engineer · PHP Backend Engineer',
                'ar' => 'مهندس برمجيات باك اند · مهندس PHP باك اند',
            ],
            'summary' => [
                'en' => 'Backend Software Engineer focused on PHP and Laravel: secure RESTful APIs, business-critical backend services, real-time features, payment integrations, and data-driven applications. Strong in MySQL design and query optimization, Redis caching, background queues, automated testing, Docker, CI/CD, and production debugging, using AI-assisted engineering with independent technical validation.',
                'ar' => 'مهندس برمجيات باك اند متخصص في PHP وLaravel: واجهات RESTful آمنة، وخدمات باك اند حيوية للأعمال، وميزات فورية، وتكامل بوابات الدفع، وتطبيقات قائمة على البيانات. متمكن من تصميم قواعد بيانات MySQL وتحسين الاستعلامات، والتخزين المؤقت باستخدام Redis، وطوابير المهام الخلفية، والاختبارات الآلية، وDocker، وCI/CD، وتتبع أخطاء بيئة الإنتاج، مع استخدام أدوات الهندسة المدعومة بالذكاء الاصطناعي والتحقق المستقل من كل حل.',
            ],
            'about' => [
                'en' => "I build the part of a product that has to keep working when real traffic arrives: APIs, payments, queues, and real-time updates. Since January 2025 I have shipped backends for delivery, marketplace, auction, e-commerce, booking, and field-service platforms.\n\nI care about clear API contracts, databases designed for the queries they will actually run, and tests that make change safe. I use AI-assisted tools for codebase analysis, debugging, and test generation, and I validate every result myself before it ships.\n\nI am based in Mansoura, Egypt, and open to relocation.",
                'ar' => "أبني الجزء من المنتج الذي يجب أن يستمر في العمل عندما يصل الاستخدام الحقيقي: الواجهات البرمجية، والمدفوعات، وطوابير المهام، والتحديثات الفورية. منذ يناير 2025 طوّرت أنظمة باك اند لمنصات توصيل، وأسواق إلكترونية، ومزادات، وتجارة إلكترونية، وحجوزات، وخدمات صيانة ميدانية.\n\nأهتم بعقود API واضحة، وقواعد بيانات مصممة للاستعلامات التي ستُنفَّذ فعلًا، واختبارات تجعل التغيير آمنًا. أستخدم أدوات مدعومة بالذكاء الاصطناعي لتحليل الشيفرة وتتبع الأخطاء وتوليد الاختبارات، وأتحقق بنفسي من كل نتيجة قبل إطلاقها.\n\nمقيم في المنصورة، مصر، ومنفتح على الانتقال للعمل خارجها.",
            ],
            'location' => ['en' => 'Mansoura, Egypt', 'ar' => 'المنصورة، مصر'],
            'availability' => Availability::OpenToRelocation,
            'availability_text' => ['en' => 'Open to relocation', 'ar' => 'منفتح على الانتقال'],
            'open_to_relocation' => true,
            'email' => 'karem.metrial@hotmail.com',
            'phone' => '+201006567821',
            'phone_visible' => false,
        ]);

        foreach ([
            [SocialPlatform::Linkedin, 'https://www.linkedin.com/in/karem-metrial'],
            [SocialPlatform::Github, 'https://github.com/KaremMetrial'],
            [SocialPlatform::Packagist, 'https://packagist.org/packages/metrial/laravel-rbac'],
        ] as $sort => [$platform, $url]) {
            $profile->socialLinks()->firstOrCreate(
                ['platform' => $platform->value],
                ['url' => $url, 'sort' => $sort],
            );
        }
    }

    /**
     * Skill groups exactly as on the CV (PRD §7.4).
     *
     * @return array<string, Skill> keyed by skill key
     */
    private function seedSkills(): array
    {
        $groups = [
            'backend' => [['Backend', 'الباك اند'], 'server', [
                'php' => 'PHP', 'laravel' => 'Laravel', 'nestjs' => 'NestJS', 'sql' => 'SQL',
                'rest-api-design' => ['RESTful API Design', 'تصميم واجهات RESTful'], 'mvc' => 'MVC', 'oop' => 'OOP',
                'design-patterns' => ['Design Patterns', 'أنماط التصميم'],
            ]],
            'data-performance' => [['Data & Performance', 'البيانات والأداء'], 'database', [
                'mysql' => 'MySQL', 'database-design' => ['Database Design', 'تصميم قواعد البيانات'],
                'query-optimization' => ['Query Optimization', 'تحسين الاستعلامات'],
                'redis' => ['Redis Caching', 'التخزين المؤقت باستخدام Redis'],
                'performance-optimization' => ['Performance Optimization', 'تحسين الأداء'],
            ]],
            'async-realtime' => [['Async & Real-Time', 'المهام غير المتزامنة والأنظمة الفورية'], 'zap', [
                'laravel-queues' => ['Laravel Queues', 'طوابير Laravel'], 'pusher' => 'Pusher', 'websockets' => 'WebSockets',
                'fcm' => 'Firebase Cloud Messaging (FCM)', 'agora' => 'Agora',
            ]],
            'testing-quality' => [['Testing & Quality', 'الاختبارات والجودة'], 'check', [
                'phpunit' => 'PHPUnit', 'pest' => 'Pest', 'api-testing' => ['API Testing', 'اختبار الواجهات البرمجية'],
                'debugging' => ['Debugging', 'تتبع الأخطاء وإصلاحها'], 'security-review' => ['Security Review', 'المراجعة الأمنية'],
                'clean-code' => ['Clean & Maintainable Code', 'شيفرة نظيفة وقابلة للصيانة'],
            ]],
            'devops-tools' => [['DevOps & Tools', 'DevOps والأدوات'], 'container', [
                'docker' => 'Docker', 'ci-cd' => 'CI/CD', 'git' => 'Git', 'github' => 'GitHub', 'composer' => 'Composer',
                'phpstorm' => 'PhpStorm', 'vscode' => 'VS Code',
            ]],
            'admin-frontend' => [['Admin & Front-End', 'لوحات التحكم والواجهات الأمامية'], 'layout', [
                'filamentphp' => 'FilamentPHP', 'blade' => 'Blade', 'html' => 'HTML', 'css' => 'CSS',
                'javascript' => 'JavaScript', 'bootstrap' => 'Bootstrap',
            ]],
            'ai-assisted' => [['AI-Assisted Engineering', 'الهندسة المدعومة بالذكاء الاصطناعي'], 'sparkles', [
                'codebase-analysis' => ['Codebase Analysis', 'تحليل الشيفرة المصدرية'],
                'ai-debugging' => ['Debugging', 'تتبع الأخطاء'],
                'test-generation' => ['Test Generation', 'توليد الاختبارات'],
                'architecture-review' => ['Architecture Review', 'مراجعة المعمارية'],
                'technical-research' => ['Technical Research', 'البحث التقني'],
            ]],
        ];

        $skills = [];
        $groupSort = 0;
        foreach ($groups as $groupKey => [[$en, $ar], $icon, $items]) {
            $group = SkillGroup::query()->firstOrCreate(
                ['key' => $groupKey],
                ['name' => ['en' => $en, 'ar' => $ar], 'icon' => $icon, 'sort' => $groupSort++],
            );

            $skillSort = 0;
            foreach ($items as $key => $name) {
                [$nameEn, $nameAr] = is_array($name) ? $name : [$name, $name];
                $skills[$key] = Skill::query()->firstOrCreate(
                    ['key' => $key],
                    ['skill_group_id' => $group->id, 'name' => ['en' => $nameEn, 'ar' => $nameAr], 'sort' => $skillSort++],
                );
            }
        }

        return $skills;
    }

    /**
     * Projects from PRD §7.3 with CV bullet points as sections.
     *
     * @param  array<string, Skill>  $skills
     * @return array<string, Project> keyed by slug
     */
    private function seedProjects(array $skills): array
    {
        $projects = [];

        foreach ($this->projectContent() as $sort => $data) {
            $project = Project::query()->where('slug', $data['slug'])->first();

            if ($project === null) {
                $project = Project::query()->create([
                    'slug' => $data['slug'],
                    'title' => $data['title'],
                    'tagline' => $data['tagline'],
                    'summary' => $data['summary'],
                    'domain' => $data['domain'],
                    'type' => $data['type'],
                    'role' => $data['role'],
                    'status' => ProjectStatus::Published,
                    'confidentiality' => $data['confidentiality'],
                    'is_featured' => $data['featured'],
                    'sort' => $sort,
                    'published_at' => now(),
                ]);

                foreach ($data['sections'] as $sectionSort => [$type, $heading, $body]) {
                    $project->sections()->create([
                        'type' => $type,
                        'heading' => $heading,
                        'body' => $body,
                        'sort' => $sectionSort,
                    ]);
                }

                foreach ($data['links'] as $linkSort => [$kind, $url, $label]) {
                    $project->links()->create([
                        'kind' => $kind,
                        'url' => $url,
                        'label' => $label,
                        'sort' => $linkSort,
                    ]);
                }

                $pivot = [];
                foreach ($data['skills'] as $skillSort => $key) {
                    $pivot[$skills[$key]->id] = ['sort' => $skillSort];
                }
                $project->skills()->sync($pivot);
            }

            $projects[$data['slug']] = $project;
        }

        return $projects;
    }

    /** @param array<string, Project> $projects */
    private function seedExperiences(array $projects): void
    {
        $experiences = [
            [
                'company' => 'Al Alamiya Elhura',
                'role' => ['en' => 'Backend Developer', 'ar' => 'مطور باك اند'],
                'type' => EmploymentType::FullTime,
                'started_on' => '2026-05-01',
                'ended_on' => null,
                'highlights' => [
                    'en' => [
                        'Develop and maintain backend applications, RESTful APIs, and business services using PHP, Laravel, and NestJS.',
                        'Implement authentication, database operations, and complex business logic while contributing to schema design, query optimization, and application performance.',
                        'Use Redis caching and background queues to support responsive and reliable backend workflows.',
                        'Troubleshoot defects, review code and security concerns, and maintain automated tests with PHPUnit/Pest within Docker and CI/CD-based workflows.',
                        'Use AI-assisted engineering tools for codebase analysis, debugging, testing, and architecture review, while independently validating solutions before delivery.',
                    ],
                    'ar' => [
                        'تطوير وصيانة تطبيقات الباك اند والواجهات البرمجية RESTful وخدمات الأعمال باستخدام PHP وLaravel وNestJS.',
                        'تنفيذ المصادقة وعمليات قواعد البيانات ومنطق الأعمال المعقد، مع المساهمة في تصميم المخططات وتحسين الاستعلامات وأداء التطبيق.',
                        'استخدام التخزين المؤقت عبر Redis وطوابير المهام الخلفية لدعم سير عمل سريع وموثوق.',
                        'تتبع الأخطاء، ومراجعة الشيفرة والجوانب الأمنية، وصيانة الاختبارات الآلية باستخدام PHPUnit وPest ضمن بيئات Docker وCI/CD.',
                        'استخدام أدوات الهندسة المدعومة بالذكاء الاصطناعي لتحليل الشيفرة وتتبع الأخطاء والاختبار ومراجعة المعمارية، مع التحقق المستقل من الحلول قبل تسليمها.',
                    ],
                ],
                'projects' => [],
            ],
            [
                'company' => 'Waitbuzz',
                'role' => ['en' => 'Back-End Developer', 'ar' => 'مطور باك اند'],
                'type' => EmploymentType::FullTime,
                'started_on' => '2025-04-01',
                'ended_on' => '2026-05-01',
                'highlights' => [
                    'en' => [
                        'Designed and maintained secure RESTful APIs for web and mobile applications, with attention to performance and maintainability.',
                        'Developed real-time Laravel Blade dashboards supporting hotel booking and reservation workflows.',
                        'Built admin functionality for room and operational management, and implemented backend business rules for day-to-day platform processes.',
                        'Optimized database operations and backend logic to improve reliability and application responsiveness.',
                    ],
                    'ar' => [
                        'تصميم وصيانة واجهات RESTful آمنة لتطبيقات الويب والجوال مع الاهتمام بالأداء وقابلية الصيانة.',
                        'تطوير لوحات تحكم فورية باستخدام Laravel Blade لدعم عمليات حجز الفنادق والحجوزات.',
                        'بناء وظائف إدارية لإدارة الغرف والعمليات، وتنفيذ قواعد الأعمال للعمليات اليومية للمنصة.',
                        'تحسين عمليات قواعد البيانات ومنطق الباك اند لرفع الموثوقية وسرعة استجابة التطبيق.',
                    ],
                ],
                'projects' => ['barq-dayem', 'sharwa', 'samoulla', 'wathiq'],
            ],
            [
                'company' => 'Rmoztec',
                'role' => ['en' => 'Back-End Developer', 'ar' => 'مطور باك اند'],
                'type' => EmploymentType::FullTime,
                'started_on' => '2025-01-01',
                'ended_on' => '2025-03-01',
                'highlights' => [
                    'en' => [
                        'Developed PHP/Laravel web applications with MySQL-backed business logic and maintainable MVC architecture.',
                        'Integrated the Moyasar payment gateway into an e-learning platform for secure online transactions.',
                        'Built and customized FilamentPHP admin dashboards to streamline content and operational workflows.',
                    ],
                    'ar' => [
                        'تطوير تطبيقات ويب باستخدام PHP وLaravel مع منطق أعمال مبني على MySQL ومعمارية MVC قابلة للصيانة.',
                        'دمج بوابة الدفع Moyasar في منصة تعليم إلكتروني لإتمام المعاملات الإلكترونية بأمان.',
                        'بناء وتخصيص لوحات تحكم FilamentPHP لتسهيل إدارة المحتوى والعمليات.',
                    ],
                ],
                'projects' => [],
            ],
            [
                'company' => 'Digital Egypt Pioneers Initiative (DEPI)',
                'role' => ['en' => 'Web Development Intern', 'ar' => 'متدرب تطوير ويب'],
                'type' => EmploymentType::Internship,
                'started_on' => '2024-04-01',
                'ended_on' => '2024-11-01',
                'highlights' => [
                    'en' => [
                        'Enhanced PHP-based applications through feature development, debugging, and backend improvements.',
                        'Optimized SQL queries and restructured database schemas to improve application response times.',
                        'Collaborated in Agile sprint planning and delivery with cross-functional team members.',
                    ],
                    'ar' => [
                        'تطوير تطبيقات مبنية على PHP عبر إضافة الميزات وتتبع الأخطاء وتحسينات الباك اند.',
                        'تحسين استعلامات SQL وإعادة هيكلة مخططات قواعد البيانات لتقليل زمن استجابة التطبيقات.',
                        'المشاركة في تخطيط وتنفيذ دورات Agile مع فرق متعددة التخصصات.',
                    ],
                ],
                'projects' => [],
            ],
        ];

        foreach ($experiences as $sort => $data) {
            $experience = Experience::query()
                ->where('company', $data['company'])
                ->whereDate('started_on', $data['started_on'])
                ->first();

            if ($experience !== null) {
                continue;
            }

            $experience = Experience::query()->create([
                'company' => $data['company'],
                'started_on' => $data['started_on'],
                'role' => $data['role'],
                'employment_type' => $data['type'],
                'location' => ['en' => 'Mansoura, Egypt', 'ar' => 'المنصورة، مصر'],
                'ended_on' => $data['ended_on'],
                'highlights' => $data['highlights'],
                'sort' => $sort,
            ]);

            $experience->projects()->sync(
                array_map(fn (string $slug): string => $projects[$slug]->id, $data['projects']),
            );
        }
    }

    private function seedEducation(): void
    {
        Education::query()->where('started_year', 2018)->exists() || Education::query()->create([
            'institution' => ['en' => 'Mansoura University', 'ar' => 'جامعة المنصورة'],
            'degree' => ['en' => 'Bachelor of Computer Science', 'ar' => 'بكالوريوس علوم الحاسب'],
            'field' => ['en' => 'Faculty of Computers & Information', 'ar' => 'كلية الحاسبات والمعلومات'],
            'started_year' => 2018,
            'ended_year' => 2022,
            'location' => ['en' => 'Mansoura, Egypt', 'ar' => 'المنصورة، مصر'],
            'sort' => 0,
        ]);
    }

    private function seedCertificates(): void
    {
        $certificates = [
            'depi-php' => [
                ['PHP Web Development', 'تطوير الويب باستخدام PHP'],
                ['Digital Egypt Pioneers Initiative (DEPI)', 'مبادرة رواد مصر الرقمية (DEPI)'],
            ],
            'ccic-backend' => [
                ['Back-End Development (PHP, MySQL, Laravel)', 'تطوير الباك اند (PHP وMySQL وLaravel)'],
                ['Consulting of Computers and Information Center (CCIC)', 'مركز استشارات الحاسبات والمعلومات (CCIC)'],
            ],
            'nti-web-design' => [
                ['Web Design (HTML, CSS, Bootstrap, JavaScript)', 'تصميم الويب (HTML وCSS وBootstrap وJavaScript)'],
                ['National Telecommunication Institute (NTI)', 'المعهد القومي للاتصالات (NTI)'],
            ],
        ];

        $sort = 0;
        foreach ($certificates as $key => [[$titleEn, $titleAr], [$issuerEn, $issuerAr]]) {
            Certificate::query()->firstOrCreate(['key' => $key], [
                'title' => ['en' => $titleEn, 'ar' => $titleAr],
                'issuer' => ['en' => $issuerEn, 'ar' => $issuerAr],
                'sort' => $sort++,
            ]);
        }
    }

    /**
     * @return list<array{
     *     slug: string, title: array<string, string>, tagline: array<string, string>, summary: array<string, string>,
     *     role: array<string, string>, domain: ProjectDomain, type: ProjectType, confidentiality: Confidentiality,
     *     featured: bool, skills: list<string>,
     *     links: list<array{0: LinkKind, 1: string, 2: array<string, string>}>,
     *     sections: list<array{0: SectionType, 1: array<string, string>, 2: array<string, string>}>
     * }>
     */
    private function projectContent(): array
    {
        $backendDeveloper = ['en' => 'Back-End Developer', 'ar' => 'مطور باك اند'];
        $whatIBuilt = ['en' => 'What I built', 'ar' => 'ما قمت ببنائه'];
        $context = ['en' => 'Context', 'ar' => 'السياق'];

        return [
            [
                'slug' => 'metrial-base-code',
                'title' => ['en' => 'Metrial Base Code, and this portfolio', 'ar' => 'Metrial Base Code وهذا الموقع'],
                'tagline' => [
                    'en' => 'A modular Laravel 12 foundation that powers the API behind this site',
                    'ar' => 'أساس Laravel 12 معياري يشغّل الواجهة البرمجية لهذا الموقع',
                ],
                'summary' => [
                    'en' => 'A production-grade modular monolith with authentication and MFA, RBAC, media pipeline, audit logs, a transactional outbox with signed webhooks, idempotency, circuit breakers, and a Socket.IO realtime service. This portfolio runs on it: the Next.js frontend reads its public API and is revalidated by its webhooks.',
                    'ar' => 'نظام أحادي معياري بجودة الإنتاج يتضمن المصادقة مع التحقق متعدد العوامل، وصلاحيات RBAC، ومسار معالجة الوسائط، وسجلات التدقيق، وصندوق صادر معاملاتي مع Webhooks موقّعة، ومنع التكرار، وقواطع الدوائر، وخدمة فورية عبر Socket.IO. هذا الموقع يعمل عليه: واجهة Next.js تقرأ الواجهة البرمجية العامة ويُعاد تحديثها عبر الـ Webhooks.',
                ],
                'role' => ['en' => 'Author and maintainer', 'ar' => 'المؤلف والمطوّر'],
                'domain' => ProjectDomain::Platform,
                'type' => ProjectType::Personal,
                'confidentiality' => Confidentiality::Public,
                'featured' => true,
                'skills' => ['laravel', 'mysql', 'redis', 'laravel-queues', 'websockets', 'docker', 'ci-cd', 'phpunit'],
                'links' => [
                    [LinkKind::Github, 'https://github.com/KaremMetrial', ['en' => 'GitHub', 'ar' => 'GitHub']],
                ],
                'sections' => [
                    [SectionType::Context, $context, [
                        'en' => 'Most backends re-implement the same foundations: authentication, permissions, file uploads, auditing, and reliable integrations. Metrial Base Code packages those as independent modules with strict layering, so a new product starts from tested infrastructure instead of a blank project.',
                        'ar' => 'تعيد معظم أنظمة الباك اند بناء نفس الأساسيات: المصادقة والصلاحيات ورفع الملفات والتدقيق والتكاملات الموثوقة. يجمع Metrial Base Code هذه الأساسيات في وحدات مستقلة بطبقات صارمة، ليبدأ أي منتج جديد من بنية تحتية مختبرة بدلًا من مشروع فارغ.',
                    ]],
                    [SectionType::Architecture, ['en' => 'Architecture', 'ar' => 'المعمارية'], [
                        'en' => "- **Modular monolith:** each module has Domain, Infrastructure, and Presentation layers, and can be switched off without a migration.\n- **Transactional outbox:** domain events are stored with the data change and relayed as signed webhooks with retries.\n- **Resilience:** idempotency keys on writes and circuit breakers around external APIs.\n- **Security:** MFA, RBAC with `resource.action` permissions, and an audit trail for every content change.\n- **Realtime:** a Socket.IO service fed through Redis with a strict event contract.",
                        'ar' => "- **نظام أحادي معياري:** لكل وحدة طبقات Domain وInfrastructure وPresentation، ويمكن إيقافها دون تعديل قاعدة البيانات.\n- **صندوق صادر معاملاتي:** تُخزَّن أحداث النطاق مع تغيير البيانات وتُرسَل كـ Webhooks موقّعة مع إعادة المحاولة.\n- **المرونة:** مفاتيح منع التكرار لعمليات الكتابة وقواطع دوائر حول الواجهات الخارجية.\n- **الأمان:** التحقق متعدد العوامل، وصلاحيات RBAC بصيغة `resource.action`، وسجل تدقيق لكل تغيير في المحتوى.\n- **الفورية:** خدمة Socket.IO تتغذى عبر Redis بعقد أحداث صارم.",
                    ]],
                ],
            ],
            [
                'slug' => 'barq-dayem',
                'title' => ['en' => 'Barq & Dayem: Delivery Platforms', 'ar' => 'برق ودايم: منصات توصيل'],
                'tagline' => [
                    'en' => 'Multi-role delivery backend with real-time tracking',
                    'ar' => 'باك اند توصيل متعدد الأدوار مع تتبع فوري',
                ],
                'summary' => [
                    'en' => 'Backend modules for users, orders, vendors, and delivery tracking in a multi-role delivery platform, with real-time notifications and delivery updates.',
                    'ar' => 'وحدات باك اند للمستخدمين والطلبات والتجار وتتبع التوصيل في منصة توصيل متعددة الأدوار، مع إشعارات وتحديثات توصيل فورية.',
                ],
                'role' => $backendDeveloper,
                'domain' => ProjectDomain::Delivery,
                'type' => ProjectType::Company,
                'confidentiality' => Confidentiality::Public,
                'featured' => true,
                'skills' => ['php', 'laravel', 'mysql', 'rest-api-design', 'pusher', 'fcm'],
                'links' => [
                    [LinkKind::PlayStore, 'https://play.google.com/store/apps/details?id=com.wb.dayemClient', ['en' => 'Dayem on Google Play', 'ar' => 'دايم على Google Play']],
                    [LinkKind::PlayStore, 'https://play.google.com/store/apps/details?id=com.barq.client', ['en' => 'Barq on Google Play', 'ar' => 'برق على Google Play']],
                ],
                'sections' => [
                    [SectionType::Role, $whatIBuilt, [
                        'en' => "- Built backend modules for users, orders, vendors, and delivery tracking in a multi-role delivery platform.\n- Implemented RESTful endpoints for order creation, assignment, and status transitions, with real-time notifications and delivery updates.\n- Designed backend structures with scalability, modularity, and clear API contracts in mind.",
                        'ar' => "- بناء وحدات باك اند للمستخدمين والطلبات والتجار وتتبع التوصيل في منصة توصيل متعددة الأدوار.\n- تنفيذ واجهات RESTful لإنشاء الطلبات وإسنادها وتغيير حالاتها، مع إشعارات وتحديثات توصيل فورية.\n- تصميم هياكل الباك اند مع مراعاة قابلية التوسع والمعيارية ووضوح عقود الواجهات البرمجية.",
                    ]],
                ],
            ],
            [
                'slug' => 'sharwa',
                'title' => ['en' => 'Sharwa: Auction & Marketplace', 'ar' => 'شروة: مزادات وسوق إلكتروني'],
                'tagline' => [
                    'en' => 'Classified listings combined with real-time auctions and instant bidding',
                    'ar' => 'إعلانات مبوبة مع مزادات فورية ومزايدة لحظية',
                ],
                'summary' => [
                    'en' => 'Marketplace functionality combining classified listings with real-time auctions: listing management, media uploads, advanced search, chat, comments, and instant bidding.',
                    'ar' => 'وظائف سوق إلكتروني تجمع بين الإعلانات المبوبة والمزادات الفورية: إدارة الإعلانات، ورفع الوسائط، والبحث المتقدم، والمحادثات، والتعليقات، والمزايدة اللحظية.',
                ],
                'role' => $backendDeveloper,
                'domain' => ProjectDomain::Marketplace,
                'type' => ProjectType::Company,
                'confidentiality' => Confidentiality::Public,
                'featured' => true,
                'skills' => ['php', 'laravel', 'mysql', 'rest-api-design', 'websockets'],
                'links' => [
                    [LinkKind::PlayStore, 'https://play.google.com/store/apps/details?id=com.wb.sharwa', ['en' => 'Sharwa on Google Play', 'ar' => 'شروة على Google Play']],
                ],
                'sections' => [
                    [SectionType::Role, $whatIBuilt, [
                        'en' => "- Developed marketplace functionality combining classified listings with real-time auctions and instant bidding interactions.\n- Implemented listing management, image and video uploads, advanced search and filtering, chat, comments, and real-time communication.\n- Structured backend services to support auctions, listings, and high-interaction user workflows securely and efficiently.",
                        'ar' => "- تطوير وظائف سوق إلكتروني تجمع بين الإعلانات المبوبة والمزادات الفورية والمزايدة اللحظية.\n- تنفيذ إدارة الإعلانات، ورفع الصور والفيديو، والبحث والتصفية المتقدمة، والمحادثات، والتعليقات، والتواصل الفوري.\n- هيكلة خدمات الباك اند لدعم المزادات والإعلانات وتفاعلات المستخدمين الكثيفة بأمان وكفاءة.",
                    ]],
                ],
            ],
            [
                'slug' => 'wathiq',
                'title' => ['en' => 'Wathiq: Service Marketplace', 'ar' => 'واثق: سوق خدمات'],
                'tagline' => [
                    'en' => 'Connecting customers with maintenance and home-service providers',
                    'ar' => 'ربط العملاء بمقدمي خدمات الصيانة والخدمات المنزلية',
                ],
                'summary' => [
                    'en' => 'A multi-role marketplace connecting customers with service providers: secure authentication, service requests, booking lifecycle, real-time status updates, ratings, and reviews.',
                    'ar' => 'سوق متعدد الأدوار يربط العملاء بمقدمي الخدمات: مصادقة آمنة، وطلبات خدمة، ودورة حياة الحجز، وتحديثات حالة فورية، وتقييمات ومراجعات.',
                ],
                'role' => $backendDeveloper,
                'domain' => ProjectDomain::ServiceMarketplace,
                'type' => ProjectType::Company,
                'confidentiality' => Confidentiality::Public,
                'featured' => true,
                'skills' => ['php', 'laravel', 'mysql', 'rest-api-design', 'websockets'],
                'links' => [
                    [LinkKind::PlayStore, 'https://play.google.com/store/apps/details?id=com.wb.wathq', ['en' => 'Wathiq on Google Play', 'ar' => 'واثق على Google Play']],
                ],
                'sections' => [
                    [SectionType::Role, $whatIBuilt, [
                        'en' => "- Built a multi-role marketplace connecting customers with service providers across maintenance and home-service categories.\n- Implemented secure authentication, service requests, booking lifecycle workflows, real-time status updates, ratings, and reviews.\n- Designed the database and backend architecture to support future payments, notifications, and third-party integrations.",
                        'ar' => "- بناء سوق متعدد الأدوار يربط العملاء بمقدمي الخدمات في فئات الصيانة والخدمات المنزلية.\n- تنفيذ المصادقة الآمنة، وطلبات الخدمة، ودورة حياة الحجز، وتحديثات الحالة الفورية، والتقييمات والمراجعات.\n- تصميم قاعدة البيانات ومعمارية الباك اند لدعم المدفوعات والإشعارات والتكاملات الخارجية مستقبلًا.",
                    ]],
                ],
            ],
            [
                'slug' => 'samoulla',
                'title' => ['en' => 'Samoulla: E-commerce Platform', 'ar' => 'صمولة: منصة تجارة إلكترونية'],
                'tagline' => [
                    'en' => 'Catalog, inventory, and orders with live tracking and shipping integration',
                    'ar' => 'كتالوج ومخزون وطلبات مع تتبع مباشر وتكامل مع الشحن',
                ],
                'summary' => [
                    'en' => 'Backend for products, inventory, orders, and payment flows, with Pusher-powered live order tracking and Bosta API integration for shipment creation and delivery tracking.',
                    'ar' => 'باك اند للمنتجات والمخزون والطلبات ومسارات الدفع، مع تتبع مباشر للطلبات عبر Pusher وتكامل مع واجهة Bosta لإنشاء الشحنات وتتبعها.',
                ],
                'role' => $backendDeveloper,
                'domain' => ProjectDomain::Ecommerce,
                'type' => ProjectType::Company,
                'confidentiality' => Confidentiality::Public,
                'featured' => false,
                'skills' => ['laravel', 'mysql', 'pusher', 'rest-api-design'],
                'links' => [
                    [LinkKind::PlayStore, 'https://play.google.com/store/apps/details?id=com.wb.samoulla', ['en' => 'Samoulla on Google Play', 'ar' => 'صمولة على Google Play']],
                ],
                'sections' => [
                    [SectionType::Role, $whatIBuilt, [
                        'en' => "- Built backend functionality for products, inventory, orders, payment flows, and real-time order updates.\n- Integrated Pusher for live order tracking and notifications, and Bosta APIs for shipment creation and delivery tracking.\n- Developed admin workflows for managing catalog, inventory, and order operations.",
                        'ar' => "- بناء وظائف الباك اند للمنتجات والمخزون والطلبات ومسارات الدفع وتحديثات الطلبات الفورية.\n- دمج Pusher لتتبع الطلبات والإشعارات مباشرة، وواجهات Bosta لإنشاء الشحنات وتتبع التوصيل.\n- تطوير مسارات إدارية لإدارة الكتالوج والمخزون وعمليات الطلبات.",
                    ]],
                ],
            ],
            [
                'slug' => 'field-service-platform',
                'title' => ['en' => 'Maintenance & Field Service Platform', 'ar' => 'منصة الصيانة والخدمات الميدانية'],
                'tagline' => [
                    'en' => 'Contracts, billing, and technician workflows',
                    'ar' => 'العقود والفوترة ومسارات عمل الفنيين',
                ],
                'summary' => [
                    'en' => 'Backend workflows for a multi-role maintenance platform serving individuals, companies, technicians, and administrators: service requests, scheduling, contract-based billing, and technician status tracking.',
                    'ar' => 'مسارات باك اند لمنصة صيانة متعددة الأدوار تخدم الأفراد والشركات والفنيين والمسؤولين: طلبات الخدمة، والجدولة، والفوترة وفق العقود، وتتبع حالة الفنيين.',
                ],
                'role' => $backendDeveloper,
                'domain' => ProjectDomain::FieldService,
                'type' => ProjectType::Company,
                'confidentiality' => Confidentiality::SummaryOnly,
                'featured' => false,
                'skills' => ['laravel', 'mysql'],
                'links' => [],
                'sections' => [
                    [SectionType::Role, $whatIBuilt, [
                        'en' => "- Developed backend workflows covering service requests, scheduling, technician assignment, and status tracking.\n- Implemented contract and billing rules: contract-specific pricing, recurring invoice schedules, signed-contract PDF uploads, and category-based cart validation.\n- Built technician workflows with timestamped status transitions, completion reports, read-only wallet balances, and settlement audit logs.",
                        'ar' => "- تطوير مسارات الباك اند لطلبات الخدمة والجدولة وإسناد الفنيين وتتبع الحالة.\n- تنفيذ قواعد العقود والفوترة: تسعير خاص بكل عقد، وجداول فواتير دورية، ورفع العقود الموقعة بصيغة PDF، والتحقق من السلة حسب الفئة.\n- بناء مسارات عمل الفنيين مع انتقالات حالة مؤرخة، وتقارير إنجاز، وأرصدة محافظ للقراءة فقط، وسجلات تدقيق للتسويات.",
                    ]],
                ],
            ],
            [
                'slug' => 'metrial-laravel-rbac',
                'title' => ['en' => 'Metrial RBAC: Laravel authorization package', 'ar' => 'Metrial RBAC: حزمة صلاحيات لـ Laravel'],
                'tagline' => [
                    'en' => 'Role-based access control for Laravel, published on Packagist',
                    'ar' => 'التحكم في الوصول حسب الأدوار لـ Laravel، منشورة على Packagist',
                ],
                'summary' => [
                    'en' => 'An open-source Laravel package for role-based access control with `resource.action` permissions, published as `metrial/laravel-rbac`.',
                    'ar' => 'حزمة Laravel مفتوحة المصدر للتحكم في الوصول حسب الأدوار بصلاحيات بصيغة `resource.action`، منشورة باسم `metrial/laravel-rbac`.',
                ],
                'role' => ['en' => 'Author and maintainer', 'ar' => 'المؤلف والمطوّر'],
                'domain' => ProjectDomain::DeveloperTools,
                'type' => ProjectType::OpenSource,
                'confidentiality' => Confidentiality::Public,
                'featured' => false,
                'skills' => ['php', 'laravel', 'oop', 'design-patterns'],
                'links' => [
                    [LinkKind::Packagist, 'https://packagist.org/packages/metrial/laravel-rbac', ['en' => 'metrial/laravel-rbac on Packagist', 'ar' => 'metrial/laravel-rbac على Packagist']],
                ],
                'sections' => [],
            ],
        ];
    }
}
