import type { FollowedSectionStreamData } from "$types/platforms/twitch/twitch.utils.types.ts";
import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";
import { type Signal, signal } from "@preact/signals";
import { render } from "preact";
import styled from "styled-components";
import TwitchModule from "../../twitch.module.ts";

export default class PinStreamerModule extends TwitchModule {
	private followsUpdater: ReturnType<typeof setInterval> | undefined;
	private previousFollowListState: FollowedSectionStreamData[] = [];
	private originalFollowList: FollowedSectionStreamData[] = [];
	private originalOfflineFollowList: FollowedSectionStreamData[] = [];

	readonly config: TwitchModuleConfig = {
		name: "pin-streamer",
		appliers: [
			{
				type: "selector",
				selectors: ['.side-nav-card__link[data-test-selector="followed-channel"]'],
				callback: async (elements: Element[], key: string) => this.run(elements),
				key: "pin-streamer",
				once: true,
			},
		],
	};

	private run(elements: Element[]) {
		this.originalFollowList = this.getPersonalSectionStreams();

		this.updateFollows();
		if (this.followsUpdater) clearInterval(this.followsUpdater);
		this.followsUpdater = setInterval(() => this.followsObserver(), 1000);

		elements.forEach(async (element) => {
			const isPinned = signal(false);

			const button = this.commonUtils().createElementByParent("pin-streamer-button", "button", element);

			const channelID = this.twitchUtils().getUserIdBySideElement(element);

			button.onclick = async (event) => {
				event.preventDefault();
				event.stopPropagation();
				isPinned.value = await this.pinStreamer(channelID);
				if (isPinned.valueOf()) button.style.display = "inline-block";
			};

			button.style.display = "none";
			element.addEventListener("mouseover", () => {
				if (isPinned.valueOf()) return;
				button.style.display = "inline-block";
			});
			element.addEventListener("mouseleave", () => {
				if (isPinned.valueOf()) return;
				button.style.display = "none";
			});

			await this.refreshFollows();
			if (channelID !== undefined) {
				const pinnedStreamers = await this.getPinnedStreamers();
				isPinned.value = pinnedStreamers.includes(channelID);
				if (isPinned.valueOf()) button.style.display = "inline-block";
				render(<PinStreamerComponent isPinned={isPinned} />, button);
			}
		});
	}

	private async updateFollows() {
		const section = this.twitchUtils().getPersonalSections()?.props;
		if (!section) return;

		if (this.originalOfflineFollowList.length && this.originalFollowList.length) {
			section.section.streams = await this.sortStreamsByPinned(
				this.originalFollowList,
				section.sort.type === "viewers_desc",
			);

			section.section.offlineChannels = await this.sortStreamsByPinned(this.originalOfflineFollowList, true);
		}
	}

	private async getPinnedStreamers(): Promise<string[]> {
		return this.localStorage().getOrDefault("pinnedStreamers", []);
	}

	private async pinStreamer(channelID: string | undefined): Promise<boolean> {
		if (!channelID) {
			return false;
		}

		const pinnedStreamers = await this.getPinnedStreamers();
		const isPinned = !pinnedStreamers.includes(channelID);

		const updatedPinnedStreamers = isPinned
			? [...pinnedStreamers, channelID]
			: pinnedStreamers.filter((id) => id !== channelID);

		await this.localStorage().save("pinnedStreamers", updatedPinnedStreamers);

		await this.followsObserver();
		await this.updateFollows();
		await this.refreshFollows();

		return isPinned;
	}

	private async sortStreamsByPinned(
		streamFollowList: FollowedSectionStreamData[],
		isSortAvailable: boolean,
	): Promise<FollowedSectionStreamData[]> {
		const pinnedStreamers = await this.getPinnedStreamers();

		const pinnedStreams: FollowedSectionStreamData[] = [];
		const regularStreams: FollowedSectionStreamData[] = [];

		streamFollowList.forEach((stream) => {
			if (pinnedStreamers.includes(stream.user.id)) {
				pinnedStreams.push(stream);
			} else {
				regularStreams.push(stream);
			}
		});

		if (isSortAvailable) {
			const sortedRegularStreams = this.sortStreamDataByViewersCount(regularStreams);
			const sortedPinnedStreams = this.sortStreamDataByViewersCount(pinnedStreams);

			this.previousFollowListState = [...sortedPinnedStreams, ...sortedRegularStreams];
		} else {
			this.previousFollowListState = [...pinnedStreams, ...regularStreams];
		}

		return this.previousFollowListState;
	}

	private async refreshFollows() {
		const section = this.twitchUtils().getPersonalSections();
		if (!section) return;
		section.forceUpdate();
	}

	private getPersonalSectionStreams() {
		return this.twitchUtils().getPersonalSections()?.props?.section.streams ?? [];
	}

	private getPersonalSectionVideoConnections() {
		return this.twitchUtils().getPersonalSections()?.props?.section.offlineChannels ?? [];
	}

	private async followsObserver() {
		const section = this.getPersonalSectionStreams();
		if (section !== this.previousFollowListState) {
			this.originalFollowList = this.getPersonalSectionStreams();
			this.originalOfflineFollowList = this.getPersonalSectionVideoConnections();
			await this.updateFollows();
			await this.refreshFollows();
		}
	}

	private sortStreamDataByViewersCount(streamDataArray: FollowedSectionStreamData[]): FollowedSectionStreamData[] {
		return streamDataArray.sort((a, b) => {
			const viewersCountA = a.content?.viewersCount ?? 0;
			const viewersCountB = b.content?.viewersCount ?? 0;
			return viewersCountB - viewersCountA;
		});
	}
}

interface PinStreamerComponentProps {
	isPinned: Signal<boolean>;
}

const Wrapper = styled.div`
	position: absolute;
	right: 10px;
	bottom: 0;
	z-index: 999;
`;

function PinStreamerComponent({ isPinned }: PinStreamerComponentProps) {
	return <Wrapper>{isPinned.value ? "★" : "☆"}</Wrapper>;
}
