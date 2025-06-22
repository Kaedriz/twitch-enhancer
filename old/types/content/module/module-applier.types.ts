export type ModuleApplierConfig = SelectorModuleApplierConfig | EventModuleApplierConfig;

export type CommonModuleApplierConfig = {
	key: string;
	cooldown?: number;
	once?: boolean;
};

export type SelectorModuleApplierConfig = {
	type: "selector";
	selectors: string[];
	callback: (elements: Element[], key: string) => Promise<void> | void;
	validateUrl?: (url: string) => boolean;
	useParent?: boolean;
} & CommonModuleApplierConfig;

export type EventModuleApplierConfig = {
	type: "event";
	event: keyof CommonEvents;
	callback: CommonEvents[keyof CommonEvents];
} & Omit<CommonModuleApplierConfig, "cooldown">;
