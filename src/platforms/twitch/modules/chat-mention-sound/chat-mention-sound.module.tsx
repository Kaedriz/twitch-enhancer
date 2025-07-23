import type { TwitchChatMessageEvent } from "$types/platforms/twitch/twitch.events.types.ts";
import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";
import TwitchModule from "../../twitch.module.ts";

export default class ChatMentionSoundModule extends TwitchModule {
	private currentUsername: string | undefined;
	private audio = new Audio();

	private defaultSound = "";

	readonly config: TwitchModuleConfig = {
		name: "chat-mention-sound",
		appliers: [
			{
				type: "event",
				key: "chat-mention-sound",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
			{
				type: "event",
				key: "chat-mention-sound",
				event: "twitch:chatInitialized",
				callback: this.setCurrentUsername.bind(this),
			},
			{
				type: "event",
				key: "chat-mention-sound",
				event: "twitch:settings:chatMentionSoundSource",
				callback: this.updateAudioSource.bind(this),
			},
			{
				type: "event",
				key: "chat-mention-sound",
				event: "twitch:settings:chatMentionSoundVolume",
				callback: this.updateAudioVolume.bind(this),
			},
		],
		isModuleEnabledCallback: () => this.settingsService().getSettingsKey("chatMentionSoundEnabled"),
	};

	async initialize() {
		this.defaultSound = await this.commonUtils().getAssetFile(this.workerService(), "modules/mention-sound.ogg", "");
		this.updateAudioSource(await this.settingsService().getSettingsKey("chatMentionSoundSource"));
		this.updateAudioVolume((await this.settingsService().getSettingsKey("chatMentionSoundVolume")) ?? 50);
	}

	private updateAudioVolume(volume: number) {
		this.audio.volume = volume / 100;
	}

	private updateAudioSource(sourceUrl: string) {
		const isCustomSound = sourceUrl.length > 3 && this.commonUtils().isValidUrl(sourceUrl);
		this.audio.src = isCustomSound ? sourceUrl : this.defaultSound;
		this.audio.load();
	}

	private setCurrentUsername() {
		const scrollableChat = this.twitchUtils().getScrollableChat()?.props;
		if (!scrollableChat) return;
		this.currentUsername = scrollableChat.currentUserLogin.toLowerCase();
		this.logger.debug(`Joined chat as ${this.currentUsername}`);
	}

	private async handleMessage({ message }: TwitchChatMessageEvent) {
		if (!(await this.isModuleEnabled())) return;
		if (!this.currentUsername) return;

		const content = message.message ?? message.messageBody;
		if (!content) return;

		if (content.toLowerCase().includes(this.currentUsername)) {
			this.playSound();
		}
	}

	playSound() {
		this.audio.load();
		if (!this.audio.paused) {
			this.audio.currentTime = 0;
		} else {
			this.audio.play()
				.then(() => this.logger.debug("Played mention sound"))
				.catch(error => this.logger.error("Failed to play mention sound:", error));
		}
	}
}
