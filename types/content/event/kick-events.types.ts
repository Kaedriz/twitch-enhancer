export type KickEvents = {
	"kick:chatMessage": (message: string) => void | Promise<void>;
};
