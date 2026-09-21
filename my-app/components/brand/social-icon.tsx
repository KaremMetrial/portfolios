import { Globe, Mail } from "lucide-react";

const socialNames: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  x: "X",
  twitter: "X",
  youtube: "YouTube",
};

/** Display name for a social platform key ("github" → "GitHub"). */
export function socialLabel(platform: string): string {
  return socialNames[platform.toLowerCase()] ?? platform;
}

type SocialIconProps = {
  platform: string;
  className?: string;
};

/**
 * Social glyphs. GitHub and LinkedIn are drawn here because lucide dropped
 * its brand icons; everything else falls back to a lucide glyph.
 */
export function SocialIcon({ platform, className }: SocialIconProps) {
  const key = platform.toLowerCase();

  if (key === "github") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.86 3.16 8.98 7.54 10.44.55.1.75-.24.75-.53v-1.86c-3.07.67-3.72-1.48-3.72-1.48-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.45-.28-5.03-1.23-5.03-5.47 0-1.21.43-2.2 1.14-2.97-.11-.28-.5-1.4.11-2.92 0 0 .93-.3 3.05 1.14a10.5 10.5 0 0 1 5.56 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.52.22 2.64.11 2.92.71.77 1.14 1.76 1.14 2.97 0 4.25-2.59 5.19-5.05 5.46.4.34.75 1.02.75 2.06v3.05c0 .29.2.64.76.53 4.37-1.46 7.53-5.58 7.53-10.44C23.02 5.24 18.27.5 12 .5Z" />
      </svg>
    );
  }

  if (key === "linkedin") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
      </svg>
    );
  }

  if (key === "email") {
    return <Mail className={className} aria-hidden="true" />;
  }

  return <Globe className={className} aria-hidden="true" />;
}
