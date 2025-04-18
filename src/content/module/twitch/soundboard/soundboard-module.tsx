import { render } from "preact";
import type { ModuleConfig } from "types/content/module/module.types.ts";
import Module from "../../module.ts";
import { SoundboardComponent } from "./SoundboardComponent.tsx";

interface Sound {
	name: string;
	sourceUrl: string;
	channelId: string;
}

interface SoundboardData {
	playSounds: Sound[];
	command: string;
}

export default class SoundboardModule extends Module {
	private soundboardData: SoundboardData | undefined;
	private previousInputContent = "";

	config: ModuleConfig = {
		name: "soundboard",
		appliers: [
			{
				type: "selector",
				selectors: [".chat-list--default"],
				callback: this.run.bind(this),
				key: "soundboard",
				once: true,
			},
		],
	};

	private async run(elements: Element[]) {
		const el = this.commonUtils().createEmptyElements(this.getId(), elements, "div");
		this.twitchUtils().addCommandToChat({
			name: "playsound",
			description: "Play soundbind",
			helpText: "Plays sound from streamer binds",
			permissionLevel: 0,
			handler: (song) => {
				this.twitchUtils().getChat().props.onSendMessage(`${this.soundboardData?.command} ${song}`);
			},
			commandArgs: [
				{
					name: "sound",
					isRequired: true,
				},
			],
		});

		await this.monitorChatInput(el);
	}

	private async monitorChatInput(elements: HTMLElement[]) {
		if (!this.soundboardData) {
			//this.soundboardData = await this.fetchSoundEffectsByTwitchId();

			if (this.soundboardData === undefined) {
				this.soundboardData = {
					playSounds: [],
					command: "",
				};
			}
		}

		setInterval(async () => {
			const chatInputContent = this.twitchUtils().getChatInputContent();

			if (!chatInputContent?.startsWith("/playsound")) {
				elements.forEach((element) => {
					element.innerHTML = "";
				});
				return;
			}

			if (chatInputContent === this.previousInputContent) return;

			this.previousInputContent = chatInputContent;

			const inputCommandParts = chatInputContent.split(" ");
			let partialSoundName = inputCommandParts[1]?.toLowerCase() || "";

			if (partialSoundName === "[sound]") partialSoundName = "";

			const matchingSounds = partialSoundName
				? this.soundboardData?.playSounds.filter((sound) => sound.name.toLowerCase().includes(partialSoundName))
				: this.soundboardData?.playSounds;

			/*elements.forEach((element) => {
				element.innerHTML = "";
				render(
					<SoundboardComponent
						key={matchingSounds?.map((sound) => sound.name).join(",")}
						onTab={(name: string) => this.twitchUtils().setChatMessage(name)}
						sounds={matchingSounds || []}
					/>,
					element,
				);
			});*/
		}, 300);
	}

	protected async fetchSoundEffectsByTwitchId() {
		const channelId = this.twitchUtils().getChannelId();

		const endpoint = `http://localhost:8080/playsounds/${channelId}`;
		try {
			const response = await fetch(endpoint, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data: SoundboardData = await response.json();
			return data;
		} catch (error) {
			console.error("Error fetching sound effects:", error);
		}
	}
}
