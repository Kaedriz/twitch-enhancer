import type WorkerService from "$shared/worker/worker.service.ts";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
	padding: 0;
	line-height: 1.6;
	color: #ccc;
	width: 100%;
	max-width: none;
`;

const Header = styled.div<{ collapsed: boolean }>`
	text-align: center;
	padding: 30px 40px;
	background: linear-gradient(
		135deg,
		rgba(145, 71, 255, 0.1) 0%,
		rgba(145, 71, 255, 0.05) 100%
	);
	border-radius: 12px;
	border: 1px solid rgba(145, 71, 255, 0.2);
	cursor: pointer;
	transition: all 0.2s ease;
	user-select: none;
	margin: 0 20px 20px 20px;
	${(props) => props.collapsed && "margin-bottom: 0;"}

	&:hover {
		background: linear-gradient(
			135deg,
			rgba(145, 71, 255, 0.15) 0%,
			rgba(145, 71, 255, 0.08) 100%
		);
		border-color: rgba(145, 71, 255, 0.3);
	}
`;

const HeaderContent = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`;

const HeaderText = styled.div`
	text-align: left;
`;

const Title = styled.h1`
	color: #9147ff;
	margin: 0 0 8px 0;
	font-size: 30px;
	font-weight: 700;
	text-shadow: 0 0 20px rgba(145, 71, 255, 0.3);
`;

const Subtitle = styled.p<{ collapsed: boolean }>`
	font-size: 13px;
	margin: 0;
	color: #e0e0e0;
	opacity: 0.9;
	transition: opacity 0.2s ease;
	${(props) =>
		props.collapsed &&
		`
		opacity: 0;
		height: 0;
		overflow: hidden;
	`}
`;

const CollapseIcon = styled.div<{ collapsed: boolean }>`
	color: #9147ff;
	font-size: 12px;
	font-weight: 600;
	transform: ${(props) => (props.collapsed ? "rotate(180deg)" : "rotate(0deg)")};
	transition: transform 0.3s ease;
	padding: 4px 8px;
	border-radius: 4px;
	background: rgba(145, 71, 255, 0.1);
	border: 1px solid rgba(145, 71, 255, 0.2);

	&:hover {
		background: rgba(145, 71, 255, 0.2);
		border-color: rgba(145, 71, 255, 0.4);
	}
`;

const Content = styled.div<{ collapsed: boolean }>`
	max-height: ${(props) => (props.collapsed ? "0" : "1000px")};
	overflow: hidden;
	transition: max-height 0.3s ease;
	opacity: ${(props) => (props.collapsed ? "0" : "1")};
`;

const Section = styled.div`
	padding: 0 20px 20px 20px;
`;

const WatchtimeList = styled.div`
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	overflow: hidden;
	height: 520px; /* Static height for exactly 10 items */
	display: flex;
	flex-direction: column;
	position: relative;
`;

const WatchtimeContent = styled.div<{ loading: boolean }>`
	flex: 1;
	display: flex;
	flex-direction: column;
	${(props) =>
		props.loading &&
		`
		opacity: 0.5;
		pointer-events: none;
	`}
`;

const LoadingOverlay = styled.div<{ show: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: ${(props) => (props.show ? "flex" : "none")};
	justify-content: center;
	align-items: center;
	background: rgba(0, 0, 0, 0.3);
	color: #9147ff;
	font-size: 12px;
	z-index: 1;
`;

const WatchtimeItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	transition: background-color 0.2s ease;
	height: 52px; /* Fixed height per item */
	box-sizing: border-box;

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background: rgba(145, 71, 255, 0.05);
	}
`;

const Username = styled.span`
	color: #e0e0e0;
	font-size: 12px;
	font-weight: 500;
`;

const WatchTime = styled.span`
	color: #9147ff;
	font-size: 11px;
	font-weight: 600;
`;

const PaginationContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
	margin-top: 20px;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
	background: ${(props) => (props.disabled ? "rgba(255, 255, 255, 0.05)" : "rgba(145, 71, 255, 0.1)")};
	border: 1px solid
	${(props) => (props.disabled ? "rgba(255, 255, 255, 0.1)" : "rgba(145, 71, 255, 0.3)")};
	color: ${(props) => (props.disabled ? "#666" : "#9147ff")};
	padding: 8px 16px;
	border-radius: 6px;
	font-size: 11px;
	font-weight: 500;
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	transition: all 0.2s ease;

	&:hover:not(:disabled) {
		background: rgba(145, 71, 255, 0.2);
		border-color: rgba(145, 71, 255, 0.4);
	}
`;

const PageInfo = styled.span`
	color: #ccc;
	font-size: 11px;
	margin: 0 8px;
`;

const EmptyContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	color: #666;
	font-size: 12px;
`;

const ErrorContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	color: #ff6b6b;
	font-size: 12px;
`;

export interface PaginatedWatchtimeResponse {
	data: WatchtimeRecord[];
	page: number;
	pageSize: number;
	total: number;
}

export interface WatchtimeRecord {
	id: string;
	platform: string;
	username: string;
	time: number;
	firstUpdate: number;
	lastUpdate: number;
}

interface EnhancerWatchtimeListComponentProps {
	workerService: () => WorkerService;
}

export function EnhancerWatchtimeListComponent({ workerService }: EnhancerWatchtimeListComponentProps) {
	const [data, setData] = useState<WatchtimeRecord[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [collapsed, setCollapsed] = useState(false);

	const pageSize = 10;

	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;

		const parts = [];

		if (hours > 0) {
			parts.push(`${hours}h`);
		}
		if (minutes > 0) {
			parts.push(`${minutes}m`);
		}
		if (remainingSeconds > 0 || parts.length === 0) {
			parts.push(`${remainingSeconds}s`);
		}

		return parts.join(" ");
	};

	const fetchWatchtime = async (page: number) => {
		try {
			setLoading(true);
			setError(null);

			const response = await workerService().send("getPaginatedWatchtime", {
				platform: "twitch",
				page: page - 1, // Convert to 0-based for API
				pageSize,
			});
			if (!response) return;

			setData(response.data);
			setCurrentPage(page);
			setHasNextPage(response.total === pageSize);
		} catch (err) {
			setError("Failed to load watchtime data");
			console.error("Error fetching watchtime:", err);
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchWatchtime(1);
	}, []);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && !loading) {
			// Prevent scroll jumping by maintaining scroll position
			const scrollY = window.scrollY;
			fetchWatchtime(newPage);
			// Restore scroll position after a brief delay
			setTimeout(() => {
				window.scrollTo(0, scrollY);
			}, 0);
		}
	};

	const toggleCollapse = () => {
		setCollapsed(!collapsed);
	};

	return (
		<Container>
			<Header collapsed={collapsed} onClick={toggleCollapse}>
				<HeaderContent>
					<HeaderText>
						<Title>Watchtime Statistics</Title>
						<Subtitle collapsed={collapsed}>Track your viewing time across streamers</Subtitle>
					</HeaderText>
					<CollapseIcon collapsed={collapsed}>▼</CollapseIcon>
				</HeaderContent>
			</Header>

			<Content collapsed={collapsed}>
				<Section>
					<WatchtimeList>
						<LoadingOverlay show={loading}>Loading watchtime data...</LoadingOverlay>

						<WatchtimeContent loading={loading}>
							{error ? (
								<ErrorContainer>{error}</ErrorContainer>
							) : data.length === 0 && !loading ? (
								<EmptyContainer>No watchtime data found</EmptyContainer>
							) : (
								data.map((record) => (
									<WatchtimeItem key={record.id}>
										<Username>{record.username}</Username>
										<WatchTime>{formatTime(record.time)}</WatchTime>
									</WatchtimeItem>
								))
							)}
						</WatchtimeContent>
					</WatchtimeList>

					{!loading && !error && (currentPage > 1 || hasNextPage) && (
						<PaginationContainer>
							<PaginationButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
								Previous
							</PaginationButton>

							<PageInfo>Page {currentPage}</PageInfo>

							<PaginationButton onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage}>
								Next
							</PaginationButton>
						</PaginationContainer>
					)}
				</Section>
			</Content>
		</Container>
	);
}
