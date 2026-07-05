import { CAPSettingsSchema, type CustomFieldConfig } from "@crazygiscool/cap";
import rawSettings from "../../../settings.json" with { type: "json" };
import themeConfig from "../../../theme.config.json" with { type: "json" };

export interface ThemeConfig {
	faviconPath: string;
	theme: {
		primaryColor: string;
		accentColor: string;
		backgroundColor: string;
		surfaceColor: string;
		cardColor: string;
		textColor: string;
		mutedTextColor: string;
		fontFamily: string;
		headingFont: string;
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
