export type CommonEvents = {
	"extension:start": () => void | Promise<void>;
	"extension:settings-open": () => void | Promise<void>;
};
