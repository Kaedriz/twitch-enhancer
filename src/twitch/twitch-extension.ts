import TwitchModuleLoader from "twitch/twitch-module.loader.ts";
import Extension from "../extension.ts";

export default class TwitchExtension extends Extension {
	protected moduleLoader = new TwitchModuleLoader(this.logger);
}
