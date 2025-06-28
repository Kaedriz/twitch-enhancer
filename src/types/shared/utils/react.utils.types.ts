export type ReactComponent<StateNode, MemoizedProps = any> = {
	stateNode: StateNode;
	pendingProps: any;
	memoizedProps: MemoizedProps;
};
