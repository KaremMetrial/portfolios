/**
 * Tests that all fixture data validates against the Zod schemas (FE-2 contract test).
 */
import { describe, expect, it } from "vitest";

import { siteFixture } from "@/lib/api/fixtures/site";
import { profileFixture } from "@/lib/api/fixtures/profile";
import { experiencesFixture } from "@/lib/api/fixtures/experiences";
import { skillsFixture } from "@/lib/api/fixtures/skills";
import {
  educationFixture,
  certificatesFixture,
} from "@/lib/api/fixtures/credentials";
import { projectsFixture } from "@/lib/api/fixtures/projects";
import { statsFixture } from "@/lib/api/fixtures/stats";

import {
  siteSchema,
  profileSchema,
  experienceSchema,
  skillGroupSchema,
  educationSchema,
  certificateSchema,
  projectCardSchema,
  statsSchema,
  envelopeSchema,
} from "@/lib/api/schemas";

describe("Fixture ↔ Schema contract", () => {
  it("site fixture validates", () => {
    expect(() => siteSchema.parse(siteFixture)).not.toThrow();
  });

  it("profile fixture validates", () => {
    expect(() => profileSchema.parse(profileFixture)).not.toThrow();
  });

  it("experiences fixture validates", () => {
    for (const exp of experiencesFixture) {
      expect(() => experienceSchema.parse(exp)).not.toThrow();
    }
  });

  it("skills fixture validates", () => {
    for (const group of skillsFixture) {
      expect(() => skillGroupSchema.parse(group)).not.toThrow();
    }
  });

  it("education fixture validates", () => {
    for (const edu of educationFixture) {
      expect(() => educationSchema.parse(edu)).not.toThrow();
    }
  });

  it("certificates fixture validates", () => {
    for (const cert of certificatesFixture) {
      expect(() => certificateSchema.parse(cert)).not.toThrow();
    }
  });

  it("projects fixture validates", () => {
    for (const proj of projectsFixture) {
      expect(() => projectCardSchema.parse(proj)).not.toThrow();
    }
  });

  it("stats fixture validates", () => {
    expect(() => statsSchema.parse(statsFixture)).not.toThrow();
  });

  it("envelope wraps data correctly", () => {
    const schema = envelopeSchema(siteSchema);
    const result = schema.parse({
      success: true,
      message: null,
      data: siteFixture,
      meta: { request_id: "123", locale: "en", direction: "ltr" },
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual(siteFixture);
  });

  it("envelope rejects invalid data", () => {
    const schema = envelopeSchema(siteSchema);
    expect(() =>
      schema.parse({
        success: true,
        data: { invalid: true },
      }),
    ).toThrow();
  });
});
