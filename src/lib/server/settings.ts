import { CAPSettingsSchema, type CustomFieldConfig, type CrawlSourceConfig } from "@crazygiscool/cap";
import rawSettings from "../../../settings.json" with { type: "json" };
import themeConfig from "../../../theme.config.json" with { type: "json" };

export interface ThemeConfig {
	faviconPath: string;
	theme: {
		primaryColor: string;
		primaryOnColor: string;
		accentColor: string;
		secondaryColor: string;
		secondaryRedColor: string;
		backgroundColor: string;
		surfaceColor: string;
		surfaceLowColor: string;
		cardColor: string;
		textColor: string;
		mutedTextColor: string;
		outlineColor: string;
		outlineVariantColor: string;
		fontFamily: string;
		headingFont: string;
		monoFont: string;
	};
	pages: { id: string; label: string; enabled: boolean }[];
}

const _theme: ThemeConfig = themeConfig as ThemeConfig;
const _settings = CAPSettingsSchema.parse(rawSettings);

export function getSettings() {
	return _settings;
}

export function getTheme(): ThemeConfig {
	return _theme;
}

export function getCustomFields(): CustomFieldConfig[] {
	return _settings.entryFormat.customFields ?? [];
}

export function getCrawlSources(): CrawlSourceConfig[] {
	return _settings.crawling?.sources ?? [];
}

export function getMergeRules(): Record<string, boolean> {
	return _settings.crawling?.mergeRules ?? {};
}
