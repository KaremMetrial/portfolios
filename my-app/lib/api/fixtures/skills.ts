import type { SkillGroup } from "../schemas";

export const skillsFixture: SkillGroup[] = [
  {
    key: "backend",
    name: "Backend",
    sort: 1,
    skills: [
      { key: "php", name: "PHP", icon: null, sort: 1, project_count: 6 },
      { key: "laravel", name: "Laravel", icon: null, sort: 2, project_count: 7 },
      { key: "nestjs", name: "NestJS", icon: null, sort: 3, project_count: 1 },
      { key: "mysql", name: "MySQL", icon: null, sort: 4, project_count: 6 },
      { key: "redis", name: "Redis", icon: null, sort: 5, project_count: 4 },
      { key: "rest-api", name: "REST APIs", icon: null, sort: 6, project_count: 6 },
      { key: "websockets", name: "WebSockets", icon: null, sort: 7, project_count: 3 },
    ],
  },
  {
    key: "data-performance",
    name: "Data & Performance",
    sort: 2,
    skills: [
      { key: "database-design", name: "Database Design", icon: null, sort: 1, project_count: 7 },
      { key: "query-optimization", name: "Query Optimization", icon: null, sort: 2, project_count: 5 },
      { key: "caching", name: "Caching", icon: null, sort: 3, project_count: 4 },
      { key: "queue-systems", name: "Queue Systems", icon: null, sort: 4, project_count: 4 },
    ],
  },
  {
    key: "async-realtime",
    name: "Async & Real-Time",
    sort: 3,
    skills: [
      { key: "queues", name: "Queues", icon: null, sort: 1, project_count: 4 },
      { key: "event-driven", name: "Event-Driven", icon: null, sort: 2, project_count: 3 },
      { key: "pusher", name: "Pusher", icon: null, sort: 3, project_count: 2 },
      { key: "fcm", name: "FCM", icon: null, sort: 4, project_count: 2 },
    ],
  },
  {
    key: "testing-quality",
    name: "Testing & Quality",
    sort: 4,
    skills: [
      { key: "phpunit", name: "PHPUnit", icon: null, sort: 1, project_count: 5 },
      { key: "pest", name: "Pest", icon: null, sort: 2, project_count: 3 },
      { key: "ci-cd", name: "CI/CD", icon: null, sort: 3, project_count: 4 },
    ],
  },
  {
    key: "devops-tools",
    name: "DevOps & Tools",
    sort: 5,
    skills: [
      { key: "docker", name: "Docker", icon: null, sort: 1, project_count: 5 },
      { key: "git", name: "Git", icon: null, sort: 2, project_count: 7 },
      { key: "linux", name: "Linux", icon: null, sort: 3, project_count: 4 },
      { key: "nginx", name: "Nginx", icon: null, sort: 4, project_count: 3 },
    ],
  },
  {
    key: "admin-frontend",
    name: "Admin & Front-End",
    sort: 6,
    skills: [
      { key: "filament", name: "FilamentPHP", icon: null, sort: 1, project_count: 3 },
      { key: "blade", name: "Blade", icon: null, sort: 2, project_count: 4 },
      { key: "html-css", name: "HTML/CSS", icon: null, sort: 3, project_count: 5 },
      { key: "javascript", name: "JavaScript", icon: null, sort: 4, project_count: 4 },
    ],
  },
  {
    key: "ai-engineering",
    name: "AI-Assisted Engineering",
    sort: 7,
    skills: [
      { key: "ai-codegen", name: "AI Code Generation", icon: null, sort: 1, project_count: 3 },
      { key: "ai-analysis", name: "AI-Assisted Analysis", icon: null, sort: 2, project_count: 2 },
      { key: "independent-validation", name: "Independent Validation", icon: null, sort: 3, project_count: 3 },
    ],
  },
];
