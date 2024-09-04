import Module from "module/module";

import { PinStreamerComponent } from "modules/twitch/favourite-streamers/component/pin-streamer.component.tsx";
import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import type { TwitchEvents } from "types/events/twitch/events";
import type { ModuleConfig, ModuleEvent } from "types/module/module";
import type { TwitchLocalStorageMap } from "types/storage/twitch/local.storage";
import type { StreamData } from "types/utils/twitch-react";

export default class PinStreamerModule extends Module<
	TwitchEvents,
	TwitchLocalStorageMap
> {
	private followsUpdater: Timer | undefined;

	private previousFollowListState: StreamData[] = [];
	private originalFollow: StreamData[] = [];
	private originalOfflineFollow: StreamData[] = [];

	protected config(): ModuleConfig {
		return {
			name: "favourite-streamers",
			elements: [
				{
					selector:
						".side-nav-card__link[data-test-selector='followed-channel']",
					once: true,
				},
			],
			platform: "twitch",
		};
	}

	protected async run(event: ModuleEvent) {
		const elements = event.elements;
		this.originalFollow = this.getPersonalSectionStreams();

		await this.updateFollows();
		if (this.followsUpdater) clearInterval(this.followsUpdater);
		this.followsUpdater = setInterval(
			async () => await this.followsObserver(),
			1000,
		);

		for (const element of elements) {
			const [isActive, setActive] = createSignal(false);

			const button = this.utils.createElementByParent(
				"pin-streamer-button",
				"button",
				element,
			);

			const channelID = this.utils.twitch.getUserIdBySideElement(element);
			button.onclick = async (event) => {
				event.preventDefault();
				event.stopPropagation();
				setActive(await this.pinStreamer(channelID));
			};

			await this.refreshFollows();

			if (channelID !== undefined) {
				setActive((await this.getPinnedStreamers()).includes(channelID));

				render(() => <PinStreamerComponent isActivated={isActive()} />, button);
			}
		}
	}

	private async sortStreamsByPinned(
		streamFollowList: StreamData[],
		sortOnline: boolean,
	): Promise<StreamData[]> {
		const favouriteStreamers = await this.getPinnedStreamers();

		const pinnedStreamers: StreamData[] = [];
		const regularStreamers: StreamData[] = [];

		streamFollowList.forEach((stream) => {
			if (favouriteStreamers.includes(stream.user.id)) {
				pinnedStreamers.push(stream);
			} else {
				regularStreamers.push(stream);
			}
		});

		if (sortOnline) {
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

	private async pinStreamer(channelID: string | undefined): Promise<boolean> {
		if (!channelID) {
			return false;
		}

		let favouriteStreamers = await this.getPinnedStreamers();
		const isFavourite = !favouriteStreamers.includes(channelID);

		favouriteStreamers = isFavourite
			? [...favouriteStreamers, channelID]
			: favouriteStreamers.filter((id) => id !== channelID);

		await this.storage.local.set("pinnedStreamers", {
			ids: favouriteStreamers,
		});

		await this.followsObserver();
		await this.updateFollows();
		await this.refreshFollows();

		return isFavourite;
	}

	private async getPinnedStreamers(): Promise<string[]> {
		return (await this.storage.local.get("pinnedStreamers"))?.ids ?? [];
	}

	private async updateFollows() {
		const section = this.utils.twitch.getPersonalSections();

		if (
			this.originalOfflineFollow.length > 0 &&
			this.originalFollow.length > 0
		) {
			// @ts-ignore
			section.stateNode.props.section.streams = await this.sortStreamsByPinned(
				this.originalFollow,
				this.utils.twitch.getPersonalSections()?.stateNode.props.sort.type ===
					"viewers_desc",
			);

			// @ts-ignore
			section.stateNode.props.section.videoConnections =
				await this.sortStreamsByPinned(this.originalOfflineFollow, true);
		}
	}

	private async refreshFollows() {
		if (!this.utils.twitch.getPersonalSections()?.stateNode.props.collapsed) {
			const refresh = this.utils.twitch.getReactInstance(
				document.querySelector(".tw-interactable"),
			).pendingProps.onClick;
			refresh();
			refresh();
		}
	}

	private async followsObserver() {
		const section = this.getPersonalSectionStreams();
		if (section !== this.previousFollowListState) {
			this.originalFollow = this.getPersonalSectionStreams();
			this.originalOfflineFollow = this.getPersonalSectionVideoConnections();
			await this.updateFollows();
			await this.refreshFollows();
		}
	}

	private getPersonalSectionStreams() {
		return (
			this.utils.twitch.getPersonalSections()?.stateNode.props.section
				.streams ?? []
		);
	}
	private getPersonalSectionVideoConnections() {
		return (
			this.utils.twitch.getPersonalSections()?.stateNode.props.section
				.videoConnections ?? []
		);
	}
	private sortStreamDataByViewersCount(
		streamDataArray: StreamData[],
	): StreamData[] {
		return streamDataArray.sort((a, b) => {
			const viewersCountA = a.content?.viewersCount ?? 0;
			const viewersCountB = b.content?.viewersCount ?? 0;

			return viewersCountB - viewersCountA;
		});
	}
}
