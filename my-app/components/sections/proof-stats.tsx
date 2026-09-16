import { Stat } from "@/components/ui/stat";
import { Reveal } from "@/components/motion/reveal";

type ProofStatsProps = {
  stats: {
    shipped_platforms: number;
    companies: number;
    public_apps: number;
    experience_since: string;
  };
  yearsOfExperience: number;
  dict: {
    eyebrow: string;
    title: string;
    platforms: string;
    companies: string;
    apps: string;
    experience: string;
  };
};

/**
 * Proof stats section (FR-FE-30, PR-A4):
 * Computed from real content only — no invented metrics.
 * Uses CountUp to animate numbers into view.
 */
export function ProofStats({ stats, yearsOfExperience, dict }: ProofStatsProps) {

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="mb-12">
          <p className="font-display text-xs font-semibold tracking-[0.25em] text-gold uppercase">
            {dict.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-offwhite sm:text-3xl">
            {dict.title}
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        <Reveal delay={0}>
          <Stat
            value={stats.shipped_platforms}
            label={dict.platforms}
            suffix="+"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Stat value={stats.companies} label={dict.companies} />
        </Reveal>
        <Reveal delay={0.2}>
          <Stat
            value={stats.public_apps}
            label={dict.apps}
            suffix="+"
          />
        </Reveal>
        <Reveal delay={0.3}>
          <Stat
            value={yearsOfExperience}
            label={dict.experience}
            suffix="yr"
          />
        </Reveal>
      </div>
    </section>
  );
}
