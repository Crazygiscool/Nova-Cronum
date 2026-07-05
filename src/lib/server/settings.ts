import { loadSettings, type CustomFieldConfig, type EntryFormatConfig } from "@crazygiscool/cap";
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

const SETTINGS_PATH = "./settings.json";

let _settings: ReturnType<typeof loadSettings> | null = null;
let _theme: ThemeConfig = themeConfig as ThemeConfig;

export function getSettings() {
	if (!_settings) {
		_settings = loadSettings(SETTINGS_PATH);
	}
	return _settings;
}

export function getTheme(): ThemeConfig {
	return _theme;
}

export function getCustomFields(): CustomFieldConfig[] {
	return getSettings().entryFormat.customFields ?? [];
}
