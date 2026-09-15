// Shared Vitest setup: registers jest-dom matchers and cleans the DOM between
// tests (Vitest globals are off, so RTL's auto-cleanup isn't triggered).
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());
