import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import {
  SiteConfigSchema,
  NavigationConfigSchema,
  ThemeConfigSchema,
  FeaturesConfigSchema,
  type SiteConfig,
  type NavigationConfig,
  type ThemeConfig,
  type FeaturesConfig,
} from '@portfolio-engine/schema';
import type { ZodError, ZodType, ZodTypeDef } from 'zod';

export interface EngineConfig {
  siteConfigPath: string;
  navigationConfigPath: string;
  themeConfigPath: string;
  featuresConfigPath: string;
}

export interface ResolvedConfig {
  site: SiteConfig;
  navigation: NavigationConfig;
  theme: ThemeConfig;
  features: FeaturesConfig;
}

async function readJson(absolutePath: string): Promise<unknown> {
  let text: string;

  try {
    text = await readFile(absolutePath, 'utf-8');
  } catch (err) {
    throw new Error(
      `[portfolio-engine] Cannot read config file "${absolutePath}"\n${String(err)}`,
    );
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(
      `[portfolio-engine] Cannot parse JSON config file "${absolutePath}"\n${String(err)}`,
    );
  }
}

function formatZodError(error: ZodError, filePath: string): string {
  const issues = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
    return `  • ${path}: ${issue.message}`;
  });
  return [`[portfolio-engine] Invalid config in "${filePath}":`, ...issues].join('\n');
}

function validate<T>(schema: ZodType<T, ZodTypeDef, unknown>, raw: unknown, filePath: string): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(formatZodError(result.error as ZodError, filePath));
  }
  return result.data;
}

export async function loadConfig(
  engineConfig: EngineConfig,
  projectRoot: URL,
): Promise<ResolvedConfig> {
  const root = fileURLToPath(projectRoot);

  const siteConfigPath = resolve(root, engineConfig.siteConfigPath);
  const navigationConfigPath = resolve(root, engineConfig.navigationConfigPath);
  const themeConfigPath = resolve(root, engineConfig.themeConfigPath);
  const featuresConfigPath = resolve(root, engineConfig.featuresConfigPath);

  const [siteRaw, navRaw, themeRaw, featuresRaw] = await Promise.all([
    readJson(siteConfigPath),
    readJson(navigationConfigPath),
    readJson(themeConfigPath),
    readJson(featuresConfigPath),
  ]);

  return {
    site: validate<SiteConfig>(SiteConfigSchema, siteRaw, siteConfigPath),
    navigation: validate<NavigationConfig>(
      NavigationConfigSchema,
      navRaw,
      navigationConfigPath,
    ),
    theme: validate<ThemeConfig>(ThemeConfigSchema, themeRaw, themeConfigPath),
    features: validate<FeaturesConfig>(
      FeaturesConfigSchema,
      featuresRaw,
      featuresConfigPath,
    ),
  };
}
