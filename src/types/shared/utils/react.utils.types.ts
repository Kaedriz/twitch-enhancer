export type ReactComponent<StateNode, MemoizedProps = any> = {
	stateNode: StateNode & { render: (...data: any[]) => any };
	pendingProps: any;
	memoizedProps: MemoizedProps;
};
