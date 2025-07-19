export type ReactComponent<StateNode, MemoizedProps = any, PendingProps = any> = {
	stateNode: StateNode & { render: (...data: any[]) => any };
	pendingProps: PendingProps;
	memoizedProps: MemoizedProps;
};
