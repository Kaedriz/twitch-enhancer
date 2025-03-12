import Module from "module/core/module.ts";
import { SoundboardComponent } from "module/twitch/soundboard/SoundboardComponent.tsx";
import { render } from "preact";
import type { ModuleConfig } from "types/module/module.types.ts";

interface Sound {
	name: string;
	sourceUrl: string;
}

interface SoundboardData {
	sounds: Sound[];
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
		const el = this.utilsRepository.commonUtils.createEmptyElements(
			this.getId(),
			elements,
			"div",
		);
		try {
			if (!this.soundboardData) {
				this.soundboardData = await this.fetchSoundEffectsByTwitchId();

				if (this.soundboardData === undefined) {
					this.soundboardData = {
						sounds: [
							{
								name: "wiktorek",
								sourceUrl:
									"https://cdn.streamelements.com/uploads/177f5046-88e8-49dc-ae8d-c838c6bd9ef9.mp3",
							},
							{
								name: "kosa",
								sourceUrl:
									"https://cdn.streamelements.com/uploads/86195762-289d-421f-84b9-03b7daa8cd1d.mp3",
							},
							{
								name: "defuse",
								sourceUrl:
									"https://cdn.streamelements.com/uploads/b28a55e8-cdc6-4a45-b08c-bbf5d5458e98.mp3",
							},
						],
						command: "!playsound",
					};
				}
			}
		} catch (error) {
			console.error("Error fetching sound effects:", error);
			this.soundboardData = {
				sounds: [
					{
						name: "wiktorek",
						sourceUrl:
							"https://cdn.streamelements.com/uploads/177f5046-88e8-49dc-ae8d-c838c6bd9ef9.mp3",
					},
					{
						name: "kosa",
						sourceUrl:
							"https://cdn.streamelements.com/uploads/86195762-289d-421f-84b9-03b7daa8cd1d.mp3",
					},
					{
						name: "defuse",
						sourceUrl:
							"https://cdn.streamelements.com/uploads/b28a55e8-cdc6-4a45-b08c-bbf5d5458e98.mp3",
					},
				],
				command: "!playsound",
			};
		}
		this.utilsRepository.twitchUtils.addCommandToChat({
			name: "playsound",
			description: "Play soundbind",
			helpText: "Plays sound from streamer binds",
			permissionLevel: 0,
			handler: (song) => {
				this.utilsRepository.twitchUtils
					.getChat()
					.props.onSendMessage(`${this.soundboardData?.command} ${song}`);
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
		setInterval(async () => {
			const chatInputContent =
				this.utilsRepository.twitchUtils.getChatInputContent();

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
				? this.soundboardData?.sounds.filter((sound) =>
						sound.name.toLowerCase().includes(partialSoundName),
					)
				: this.soundboardData?.sounds;

			elements.forEach((element) => {
				element.innerHTML = "";
				render(
					<SoundboardComponent
						onTab={(name: string) =>
							this.utilsRepository.twitchUtils.sendChatMessage(name)
						}
						sounds={matchingSounds || []}
					/>,
					element,
				);
			});
		}, 300);
	}

	protected async fetchSoundEffectsByTwitchId() {
		const channelId =
			this.utilsRepository.twitchUtils.getChat().props.channelID;

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
