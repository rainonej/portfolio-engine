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
import type { ZodError, ZodTypeAny } from 'zod';

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
  try {
    const text = await readFile(absolutePath, 'utf-8');
    return JSON.parse(text);
  } catch (err) {
    throw new Error(
      `[portfolio-engine] Cannot read config file "${absolutePath}"\n${String(err)}`,
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

function validate<T>(schema: ZodTypeAny, raw: unknown, filePath: string): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(formatZodError(result.error as ZodError, filePath));
  }
  return result.data as T;
}

export async function loadConfig(
  engineConfig: EngineConfig,
  projectRoot: URL,
): Promise<ResolvedConfig> {
  const root = fileURLToPath(projectRoot);

  const [siteRaw, navRaw, themeRaw, featuresRaw] = await Promise.all([
    readJson(resolve(root, engineConfig.siteConfigPath)),
    readJson(resolve(root, engineConfig.navigationConfigPath)),
    readJson(resolve(root, engineConfig.themeConfigPath)),
    readJson(resolve(root, engineConfig.featuresConfigPath)),
  ]);

  return {
    site: validate<SiteConfig>(SiteConfigSchema, siteRaw, engineConfig.siteConfigPath),
    navigation: validate<NavigationConfig>(
      NavigationConfigSchema,
      navRaw,
      engineConfig.navigationConfigPath,
    ),
    theme: validate<ThemeConfig>(ThemeConfigSchema, themeRaw, engineConfig.themeConfigPath),
    features: validate<FeaturesConfig>(
      FeaturesConfigSchema,
      featuresRaw,
      engineConfig.featuresConfigPath,
    ),
  };
}
