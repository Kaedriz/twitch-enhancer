export type ReactComponent<StateNode, MemoizedProps = any, PendingProps = any> = {
	stateNode: StateNode;
	pendingProps: PendingProps;
	memoizedProps: MemoizedProps;
};
