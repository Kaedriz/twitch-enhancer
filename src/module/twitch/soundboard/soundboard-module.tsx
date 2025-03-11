import { useSignal } from "@preact/signals";
import Module from "module/core/module.ts";
import { render } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import styled from "styled-components";
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
		this.monitorChatInput(el);
		if (!this.soundboardData) {
			this.soundboardData = await this.fetchSoundEffectsByTwitchId(
				this.utilsRepository.twitchUtils.getCurrentChannelByUrl(),
			);
		}
		this.utilsRepository.twitchUtils.addCommandToChat({
			name: "playsound",
			description: "Play soundbind",
			helpText: "Plays sound from streamer binds",
			permissionLevel: 0,
			handler: (song) => {
				console.log(song);
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
					() => (
						<SoundboardComponent
							onTab={(name: string) =>
								this.utilsRepository.twitchUtils.sendChatMessage(name)
							}
							sounds={matchingSounds || []}
						/>
					),
					element,
				);
			});
		}, 300);
	}

	protected async fetchSoundEffectsByTwitchId(channelId: string) {
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
			throw error;
		}
	}
}

interface Sound {
	name: string;
	sourceUrl: string;
}

interface SoundboardComponentProps {
	sounds: Sound[] | undefined;
	onTab: (name: string) => void;
}

const SoundboardComponent = ({ sounds, onTab }: SoundboardComponentProps) => {
	const [playingSound, setPlayingSound] = useState<string | null>(null);
	const selectedIndex = useSignal(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const playSound = (sourceUrl: string) => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}
		const audio = new Audio(sourceUrl);
		audio.play();
		setPlayingSound(sourceUrl);
		audioRef.current = audio;

		audio.addEventListener("ended", () => {
			setPlayingSound(null);
			audioRef.current = null;
		});
	};

	const stopSound = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}
		setPlayingSound(null);
	};

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!sounds?.length) return;

			switch (e.key) {
				case "ArrowUp": {
					e.preventDefault();
					selectedIndex.value =
						selectedIndex.value - 1 < 0
							? sounds.length - 1
							: selectedIndex.value - 1;
					break;
				}
				case "ArrowDown": {
					e.preventDefault();
					selectedIndex.value =
						selectedIndex.value + 1 >= sounds.length
							? 0
							: selectedIndex.value + 1;
					break;
				}
				case "Tab": {
					e.preventDefault();
					const currentSound = sounds[selectedIndex.value];
					onTab(currentSound.name);
					break;
				}
			}
		},
		[sounds, selectedIndex, onTab],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<div>
			{sounds?.map((sound, index) => (
				<div
					key={sound.name}
					onClick={() => {
						selectedIndex.value = index;
						onTab(sound.name);
					}}
				>
					<span>{sound.name}</span>
					{playingSound === sound.sourceUrl ? (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								stopSound();
							}}
						>
							Stop
						</button>
					) : (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								playSound(sound.sourceUrl);
							}}
						>
							Play
						</button>
					)}
				</div>
			))}
		</div>
	);
};
