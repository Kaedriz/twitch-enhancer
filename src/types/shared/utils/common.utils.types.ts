export type WaitForConfig = {
	delay: number;
	maxRetries: number;
	initialDelay?: number;
	notFoundCallback?: () => Promise<void> | void;
};
