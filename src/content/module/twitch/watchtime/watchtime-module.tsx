import { signal } from "@preact/signals";
import Module from "module/module.ts";
import {
	WatchTimePopupErrorMessage,
	WatchTimePopupLoadingMessage,
	WatchTimePopupMessage,
	WatchTimeUserCard,
} from "module/twitch/watchtime/wachtime-card.tsx";

import { render } from "preact";
import type { EnhancerStreamerWatchTimeData } from "types/content/api/enhancer-api.types.ts";
import type { ModuleConfig } from "types/content/module/module.types.ts";

export default class WatchTimeModule extends Module {
	private isLoadingPopupVisible = false;

	config: ModuleConfig = {
		name: "watchtime",
		appliers: [
			{
				type: "event",
				event: "twitch:chatInitialized",
				callback: this.addCommand.bind(this),
				key: "watchtime-chat",
				once: true,
			},
			{
				type: "selector",
				selectors: [".viewer-card"],
				callback: this.run.bind(this),
				key: "watchtime-usercard",
				once: true,
			},
		],
	};

	private async run(elements: Element[]) {
		const wrapper = this.utilsRepository.commonUtils.createEmptyElements(this.getId(), elements, "div");
		const username = this.utilsRepository.twitchUtils.getUserCardTargetName();
		if (!username) {
			this.logger.error("Failed to found username from usercard");
			return;
		}

		const data = signal<undefined | EnhancerStreamerWatchTimeData[]>(undefined);
		const isLoading = signal(true);
		const isError = signal(false);

		wrapper.forEach((element) => {
			render(<WatchTimeUserCard username={username} data={data} isLoading={isLoading} isError={isError} />, element);
		});

		try {
			data.value = await this.enhancerApi().getUserWatchTime(username);
			isLoading.value = false;
		} catch (error) {
			this.logger.error(`Failed to fetch usercard watchtime ${username}`, error);
			isError.value = true;
			isLoading.value = false;
		}
	}

	private async addCommand() {
		this.logger.info("adding command");
		this.utilsRepository.twitchUtils.addCommandToChat({
			name: "watchtime",
			description: "See user's watchtime from xayo.pl service",
			helpText: "Missing username",
			permissionLevel: 0,
			handler: async (username) => {
				const name = username.replace(/^@/, "");
				this.renderLoading(name);
				try {
					const data = await this.fetchWatchTimeByUserName(name.toLowerCase());
					this.renderWatchTime(name, data);
				} catch (error) {
					this.logger.error(`Failed to fetch watchtime for ${username}`, error);
					this.renderError(name);
				}
			},
			commandArgs: [
				{
					name: "username",
					isRequired: true,
				},
			],
		});
	}

	private async fetchWatchTimeByUserName(username: string): Promise<EnhancerStreamerWatchTimeData[]> {
		return await this.enhancerApi().getUserWatchTime(username);
	}

	private renderLoading(username: string) {
		this.isLoadingPopupVisible = true;
		this.eventEmitter.emit("twitch:chatPopupMessage", {
			title: `Fetching data for ${username}`,
			autoclose: 60,
			content: <WatchTimePopupLoadingMessage />,
			onClose: () => this.handleLoadingPopupClose(),
		});
	}

	private renderWatchTime(username: string, data: EnhancerStreamerWatchTimeData[]) {
		if (!this.isLoadingPopupVisible) {
			return;
		}
		this.isLoadingPopupVisible = false;
		this.eventEmitter.emit("twitch:chatPopupMessage", {
			title: `Watchtime for ${username}`,
			autoclose: 15,
			content: <WatchTimePopupMessage username={username} watchTime={data} />,
		});
	}

	private renderError(username: string) {
		if (!this.isLoadingPopupVisible) {
			return;
		}
		this.isLoadingPopupVisible = false;
		this.eventEmitter.emit("twitch:chatPopupMessage", {
			title: `Failed to fetch watchtime for ${username}`,
			autoclose: 15,
			content: <WatchTimePopupErrorMessage />,
		});
	}

	private handleLoadingPopupClose() {
		this.isLoadingPopupVisible = false;
	}
}
