import { KICK_DEFAULT_SETTINGS } from "$kick/kick.constants.ts";
import KickModule from "$kick/kick.module.ts";
import { EnhancerAboutComponent } from "$shared/components/settings/about.component.tsx";
import Settings, { SettingsOverlay } from "$shared/components/settings/settings.component.tsx";
import type { KickSettings } from "$types/platforms/kick/kick.settings.types.ts";
import type { SettingDefinition, TabDefinition } from "$types/shared/components/settings.component.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";
import { type Signal, signal } from "@preact/signals";
import { render } from "preact";

export default class SettingsModule extends KickModule {
	config: KickModuleConfig = {
		name: "settings",
		appliers: [
			{
				type: "event",
				event: "extension:start",
				callback: this.run.bind(this),
				key: "settings",
			},
			{
				type: "event",
				event: "extension:settings-open",
				callback: this.openSettings.bind(this),
				key: "settings-open",
			},
		],
	};

	private SETTINGS_TABS: TabDefinition[] = [];
	private SETTING_DEFINITIONS: SettingDefinition<KickSettings>[] = [];

	private settingsSignal: Signal<KickSettings> = signal(KICK_DEFAULT_SETTINGS);
	private isOpenSignal: Signal<boolean> = signal(false);
	private settingsContainer: HTMLDivElement | null = null;

	async initialize() {
		this.SETTINGS_TABS = [
			{
				title: "General",
				iconUrl: await this.commonUtils().getIcon(this.workerService(), "settings/general.svg"),
			},
			{
				title: "Chat",
				iconUrl: await this.commonUtils().getIcon(this.workerService(), "settings/chat.svg"),
			},
			{
				title: "Channel",
				iconUrl: await this.commonUtils().getIcon(this.workerService(), "settings/channel.svg"),
			},
			{
				title: "About",
				iconUrl: await this.commonUtils().getIcon(this.workerService(), "settings/about.svg"),
			},
		];
		const brandIcons = {
			website: await this.commonUtils().getIcon(this.workerService(), "brands/website.svg"),
			github: await this.commonUtils().getIcon(this.workerService(), "brands/github.svg"),
			twitter: await this.commonUtils().getIcon(this.workerService(), "brands/twitter.svg"),
			discord: await this.commonUtils().getIcon(this.workerService(), "brands/discord.svg"),
		};
		this.SETTING_DEFINITIONS = [
			{
				id: "chatImagesEnabled",
				title: "Enable Chat Images",
				description: "Show images in chat messages",
				type: "toggle",
				tabIndex: 1,
			},
			{
				id: "chatImagesOnHover",
				title: "Blur Images by Default",
				description: "Images are blurred until you hover over them, revealing the full image.",
				type: "toggle",
				tabIndex: 1,
			},
			{
				id: "chatImagesSize",
				title: "Chat Image Size",
				description: "Size of images in chat (in megabytes)",
				type: "number",
				tabIndex: 1,
				min: 1,
				step: 1,
			},
			{
				id: "quickAccessLinks",
				title: "Quick Access Links",
				description: "Manage your quick access links with custom names and URLs",
				type: "array",
				tabIndex: 2,
				arrayItemFields: [
					{ name: "title", placeholder: "Enter link name..." },
					{ name: "url", placeholder: "Enter URL..." },
				],
			},
			{
				id: "about",
				title: "About This Extension",
				description: "Information about the extension",
				type: "text",
				tabIndex: 3,
				content: () => {
					return <EnhancerAboutComponent icons={brandIcons} />;
				},
				hideInfo: true,
			},
		];
	}

	private async run() {
		await this.loadSettings();
		await this.createSettingsContainer();
		this.setupKeyboardShortcut();
	}

	private async loadSettings() {
		try {
			this.settingsSignal.value = { ...KICK_DEFAULT_SETTINGS, ...(await this.settingsService().getSettings()) };
		} catch (error) {
			console.error("Failed to load settings:", error);
		}
	}

	private async saveSettings(settings: KickSettings, updatedKey: keyof KickSettings) {
		try {
			await this.settingsService().updateSettings(settings);
			this.settingsSignal.value = settings;
			this.emitter.emit(`kick:settings:${updatedKey}`, settings[updatedKey]);
			this.logger.debug(`Settings changed "${updatedKey}"`, settings[updatedKey]);
		} catch (error) {
			console.error("Failed to save settings:", error);
		}
	}

	private async createSettingsContainer() {
		const wrapper = this.commonUtils().createElementByParent(
			"enhancer-settings",
			"div",
			document.body,
		) as HTMLDivElement;
		this.settingsContainer = wrapper as HTMLDivElement;
		const logo = await this.commonUtils().getIcon(
			this.workerService(),
			"enhancer/logo.svg",
			"https://enhancer.at/assets/brand/logo.png",
		);
		const renderSettings = () => {
			if (this.settingsContainer) {
				render(
					<SettingsOverlay style={{ display: this.isOpenSignal.value ? "flex" : "none" }}>
						<Settings
							logoSrc={logo}
							tabs={this.SETTINGS_TABS}
							settingDefinitions={this.SETTING_DEFINITIONS}
							settings={this.settingsSignal.value}
							onSettingsChange={(newSettings, updatedKey) => this.saveSettings(newSettings, updatedKey)}
							onClose={() => this.closeSettings()}
						/>
					</SettingsOverlay>,
					this.settingsContainer,
				);
			}
		};
		renderSettings();

		this.isOpenSignal.subscribe(renderSettings);
		this.settingsSignal.subscribe(renderSettings);
	}

	private setupKeyboardShortcut() {
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && this.isOpenSignal.value) {
				this.closeSettings();
			}
		});
	}

	private openSettings() {
		this.isOpenSignal.value = true;
	}

	private closeSettings() {
		this.isOpenSignal.value = false;
	}
}
