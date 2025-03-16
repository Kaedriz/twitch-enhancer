import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import styled from "styled-components";

interface Sound {
	name: string;
	sourceUrl: string;
}

interface SoundboardComponentProps {
	sounds: Sound[] | undefined;
	onTab: (name: string) => void;
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	background-color: #494848;
`;

const SoundItem = styled.div<{ isSelected: boolean }>`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.2s;
	background-color: ${(props) => (props.isSelected ? "#3b82f6" : "transparent")};
	color: ${(props) => (props.isSelected ? "white" : "inherit")};

	&:hover {
		background-color: ${(props) => (props.isSelected ? "#2563eb" : "rgba(0, 0, 0, 0.05)")};
	}
`;

const SoundName = styled.span`
	margin-right: 16px;
`;

const ControlButton = styled.button<{ isSelected: boolean }>`
	padding: 4px 12px;
	border-radius: 4px;
	border: 1px solid currentColor;
	background: transparent;
	cursor: pointer;
	color: ${(props) => (props.isSelected ? "white" : "inherit")};
	border-color: ${(props) => (props.isSelected ? "white" : "currentColor")};
`;

export function SoundboardComponent({
	sounds,
	onTab,
}: SoundboardComponentProps) {
	const [playingSound, setPlayingSound] = useState<string | null>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const playSound = (sourceUrl: string) => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}
		audioRef.current = new Audio(sourceUrl);
		audioRef.current.play();
		setPlayingSound(sourceUrl);

		audioRef.current.addEventListener("ended", () => {
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

	const getChatInputContent = useCallback(() => {
		const chatInputElement = document.querySelector(
			'span[data-a-target="chat-input-text"]',
		) as HTMLTextAreaElement | null;
		return chatInputElement?.textContent || "";
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const chatInputContent = getChatInputContent();
			if (!chatInputContent.startsWith("/playsound") || !sounds?.length) return;

			switch (e.key) {
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) =>
						prev - 1 < 0 ? sounds?.length - 1 : prev - 1,
					);
					break;
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) =>
						prev + 1 >= sounds?.length ? 0 : prev + 1,
					);
					break;
				case "Tab": {
					e.preventDefault();
					const currentSound = sounds[selectedIndex];
					onTab(currentSound.name);
					break;
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [sounds, selectedIndex, onTab, getChatInputContent]);

	return (
		<Wrapper>
			{sounds?.map((sound, index) => (
				<SoundItem
					key={sound.name}
					isSelected={index === selectedIndex}
					onClick={() => {
						setSelectedIndex(index);
						onTab(sound.name);
					}}
				>
					<SoundName>{sound.name}</SoundName>
					{playingSound === sound.sourceUrl ? (
						<ControlButton
							type="button"
							isSelected={index === selectedIndex}
							onClick={(e) => {
								e.stopPropagation();
								stopSound();
							}}
						>
							Stop
						</ControlButton>
					) : (
						<ControlButton
							type="button"
							isSelected={index === selectedIndex}
							onClick={(e) => {
								e.stopPropagation();
								playSound(sound.sourceUrl);
							}}
						>
							Play
						</ControlButton>
					)}
				</SoundItem>
			))}
		</Wrapper>
	);
}
