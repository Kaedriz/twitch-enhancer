import { LoadingComponent } from "$shared/components/loading/loading.component.tsx";
import type { EnhancerStreamerWatchTimeData } from "$types/apis/enhancer.apis.ts";
import type { Signal } from "@preact/signals";
import styled from "styled-components";

// --- Shared Components & Helpers ---

const WatchTimeItem = styled.a`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 6px;
	border-bottom: 1px solid #303032;
	transition: background-color 0.2s ease;
	text-decoration: none;
	color: inherit;
	cursor: pointer;

	&:hover {
		background-color: #232326;
		text-decoration: none;
	}

	&:last-child {
		border-bottom: none;
	}
`;

const TotalWatchTimeItem = styled(WatchTimeItem)`
	margin-top: 8px;
	font-weight: 600;
	color: #bf94ff;
	border-bottom: none;
	padding-left: 4px;

	&:hover {
		text-decoration: none;
	}
`;

const formatWatchTime = (count: number): string => {
	const totalMinutes = count * 5;
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
};

interface WatchTimeDisplayProps {
	watchTime: EnhancerStreamerWatchTimeData[];
	username: string;
}

const WatchTimeDisplay = ({ watchTime, username }: WatchTimeDisplayProps) => {
	const topFive = watchTime.slice(0, 5);
	const totalCount = watchTime.reduce((acc, item) => acc + item.count, 0);

	return (
		<>
			{topFive.map((item) => (
				<WatchTimeItem
					key={item.streamer}
					href={`https://twitch.tv/${item.streamer}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<span>{item.streamer}</span>
					<span>{formatWatchTime(item.count)}</span>
				</WatchTimeItem>
			))}
			<TotalWatchTimeItem href={`https://xayo.pl/${username}`} target="_blank" rel="noopener noreferrer">
				Total watch time: {formatWatchTime(totalCount)}
			</TotalWatchTimeItem>
		</>
	);
};

// --- User Card ---

const UserCardWrapper = styled.div`
	background-color: #18181b;
	padding: 12px 16px;
	color: #efeff1;
`;

interface UserCardProps {
	username: string;
	data: Signal<undefined | EnhancerStreamerWatchTimeData[]>;
	isLoading: Signal<boolean>;
	isError: Signal<boolean>;
}

export const WatchTimeUserCard = ({ username, data, isLoading, isError }: UserCardProps) => {
	if (isLoading.value) {
		return (
			<UserCardWrapper>
				<LoadingComponent text="Fetching data from xayo.pl..." />
			</UserCardWrapper>
		);
	}

	if (isError.value) {
		return (
			<UserCardWrapper>
				<p>An unexpected error occurred and we are sorry about that :(</p>
				<p>Please try again later.</p>
			</UserCardWrapper>
		);
	}

	const watchTime = data.value;
	if (!watchTime || watchTime.length === 0) {
		return <UserCardWrapper>No watchtime data available.</UserCardWrapper>;
	}

	return (
		<UserCardWrapper>
			<strong>Watchtime of {username}:</strong>
			<WatchTimeDisplay watchTime={watchTime} username={username} />
		</UserCardWrapper>
	);
};

// --- Popup Components ---

export const WatchTimePopupLoadingMessage = () => {
	return <LoadingComponent text="Fetching data from xayo.pl..." />;
};

const PopupErrorText = styled.div`
	color: #8e8e8e;
	font-size: 13px;
`;

export const WatchTimePopupErrorMessage = () => {
	return (
		<PopupErrorText>
			An unexpected error occurred and we are sorry about that :( <br />
			Please try again later.
		</PopupErrorText>
	);
};

const PopupNoDataMessage = styled.div`
	color: #8e8e8e;
	text-align: center;
	padding: 10px 0;
`;

interface WatchTimePopupProps {
	watchTime: EnhancerStreamerWatchTimeData[];
	username: string;
}

export const WatchTimePopupMessage = ({ username, watchTime }: WatchTimePopupProps) => {
	if (!watchTime || watchTime.length === 0) {
		return <PopupNoDataMessage>No watchtime data available</PopupNoDataMessage>;
	}

	return <WatchTimeDisplay watchTime={watchTime} username={username} />;
};
