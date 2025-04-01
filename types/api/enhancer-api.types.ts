import type { Platform } from "types/extension.ts";

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
	platform: Platform; //TODO Its upperCase
	playSoundsEnabled: boolean;
	isPartner: boolean;
};

export type EnhancerResponseMap = {
	channel: EnhancerChannelDto;
	badges: EnhancerBadgesResponseDto;
	"global-badge": EnhancerBadgesResponseDto;
};
