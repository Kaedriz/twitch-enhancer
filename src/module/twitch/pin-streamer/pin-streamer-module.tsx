import { type Signal, signal } from "@preact/signals";
import Module from "module/core/module.ts";
import { render } from "preact";
import { useState } from "preact/hooks";
import styled from "styled-components";
import type { ModuleConfig } from "types/module/module.types.ts";
import type { FollowedSectionStreamData } from "types/utils/twitch-utils.types.ts";

export default class PinStreamerModule extends Module {
	private followsUpdater: ReturnType<typeof setInterval> | undefined;
	private previousFollowListState: FollowedSectionStreamData[] = [];
	private originalFollowList: FollowedSectionStreamData[] = [];
	private originalOfflineFollowList: FollowedSectionStreamData[] = [];

	config: ModuleConfig = {
		name: "pin-streamer",
		appliers: [
			{
				type: "selector",
				selectors: [
					'.side-nav-card__link[data-test-selector="followed-channel"]',
				],
				callback: this.run.bind(this),
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

			const button = this.utilsRepository.commonUtils.createElementByParent(
				"pin-streamer-button",
				"button",
				element,
			);

			const channelID =
				this.utilsRepository.twitchUtils.getUserIdBySideElement(element);

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
				isPinned.value = pinnedStreamers.ids.includes(channelID);
				if (isPinned.valueOf()) button.style.display = "inline-block";
				render(<PinStreamerComponent isPinned={isPinned} />, button);
			}
		});
	}

	private async updateFollows() {
		const section =
			this.utilsRepository.twitchUtils.getPersonalSections()?.props;
		if (!section) return;

		if (
			this.originalOfflineFollowList.length &&
			this.originalFollowList.length
		) {
			section.section.streams = await this.sortStreamsByPinned(
				this.originalFollowList,
				section.sort.type === "viewers_desc",
			);

			section.section.videoConnections = await this.sortStreamsByPinned(
				this.originalOfflineFollowList,
				true,
			);
		}
	}

	private async getPinnedStreamers(): Promise<{ ids: string[] }> {
		const result =
			await this.storageRepository.localStorage.get("pinnedStreamers");
		return result || { ids: [] };
	}

	private async pinStreamer(channelID: string | undefined): Promise<boolean> {
		if (!channelID) {
			return false;
		}

		const favouriteStreamers = await this.getPinnedStreamers();
		const isFavourite = !favouriteStreamers.ids.includes(channelID);

		favouriteStreamers.ids = isFavourite
			? [...favouriteStreamers.ids, channelID]
			: favouriteStreamers.ids.filter((id) => id !== channelID);

		await this.storageRepository.localStorage.save("pinnedStreamers", {
			ids: favouriteStreamers.ids,
		});

		await this.followsObserver();
		await this.updateFollows();
		await this.refreshFollows();

		return isFavourite;
	}

	private async sortStreamsByPinned(
		streamFollowList: FollowedSectionStreamData[],
		isSortAvailable: boolean,
	): Promise<FollowedSectionStreamData[]> {
		const favouriteStreamers = await this.getPinnedStreamers();

		const pinnedStreamers: FollowedSectionStreamData[] = [];
		const regularStreamers: FollowedSectionStreamData[] = [];

		streamFollowList.forEach((stream) => {
			if (favouriteStreamers.ids.includes(stream.user.id)) {
				pinnedStreamers.push(stream);
			} else {
				regularStreamers.push(stream);
			}
		});

		if (isSortAvailable) {
			const sortedRegularStreamers =
				this.sortStreamDataByViewersCount(regularStreamers);
			const sortedPinnedStreamers =
				this.sortStreamDataByViewersCount(pinnedStreamers);

			this.previousFollowListState = [
				...sortedPinnedStreamers,
				...sortedRegularStreamers,
			];
		} else {
			this.previousFollowListState = [...pinnedStreamers, ...regularStreamers];
		}

		return this.previousFollowListState;
	}

	private async refreshFollows() {
		const section = this.utilsRepository.twitchUtils.getPersonalSections();
		if (!section) return;
		section.forceUpdate();
	}

	private getPersonalSectionStreams() {
		return (
			this.utilsRepository.twitchUtils.getPersonalSections()?.props?.section
				.streams ?? []
		);
	}

	private getPersonalSectionVideoConnections() {
		return (
			this.utilsRepository.twitchUtils.getPersonalSections()?.props?.section
				.videoConnections ?? []
		);
	}

	private async followsObserver() {
		const section = this.getPersonalSectionStreams();
		if (section !== this.previousFollowListState) {
			this.originalFollowList = this.getPersonalSectionStreams();
			this.originalOfflineFollowList =
				this.getPersonalSectionVideoConnections();
			await this.updateFollows();
			await this.refreshFollows();
		}
	}

	private sortStreamDataByViewersCount(
		streamDataArray: FollowedSectionStreamData[],
	): FollowedSectionStreamData[] {
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
