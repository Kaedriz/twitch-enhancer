import type { PlatformType } from "$types/shared/platform.types.ts";

export type EnhancerBadgesResponseDto = {
	channelId: string;
	badges: EnhancerBadge[];
	users: EnhancerBadgeUser[];
};

export type EnhancerBadge = {
	badgeId: string;
	name: string;
	description: string;
	sources: Record<EnhancerBadgeSize, string>;
	priority: number;
};

export type EnhancerBadgeUser = {
	userId: string;
	externalId: string;
	badgesIds: string[];
};

export type EnhancerBadgeSize = "1x" | "2x" | "4x";

export type EnhancerChannelDto = {
	channelId: string;
	platform: PlatformType; //TODO Its upperCase
	playSoundsEnabled: boolean;
	isPartner: boolean;
};

export type EnhancerResponseMap = {
	channel: EnhancerChannelDto;
	badges: EnhancerBadgesResponseDto;
	"global-badge": EnhancerBadgesResponseDto;
};

export type EnhancerStreamerWatchTimeData = {
	streamer: string;
	count: number;
};
