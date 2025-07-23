import { TooltipComponent } from "$shared/components/tooltip/tooltip.component.tsx";
import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";
import { render } from "preact";
import styled from "styled-components";
import TwitchModule from "../../twitch.module.ts";

export default class SettingsButtonModule extends TwitchModule {
	readonly config: TwitchModuleConfig = {
		name: "settings-button",
		appliers: [
			{
				type: "selector",
				selectors: [".top-nav__menu"],
				callback: this.run.bind(this),
				key: "settings-button-main",
				once: true,
			},
			{
				type: "selector",
				selectors: [".top-nav__menu .ffz-top-nav"],
				callback: this.setProperOrder.bind(this),
				key: "ffz_icon",
				once: true,
			},
			{
				type: "selector",
				selectors: [".top-nav__menu #seventv-settings-button"],
				callback: this.setProperOrder.bind(this),
				key: "7TV_ICON",
				once: true,
			},
		],
	};

	private static readonly ICONS_ORDER_MAP: Record<string, string> = {
		ENHANCER_ICON: "-5",
		FFZ_ICON: "-4",
		"7TV_ICON": "-3",
	};

	private async run(elements: Element[], key: string) {
		const isChat = key === "settings-button-chat";
		const properElements = elements
			.filter((element) => element.children.length > 0)
			.map((element) => [...element.children].at(-1))
			.filter((element) => element !== undefined) as Element[];
		const wrappers = this.commonUtils().createEmptyElements(this.getId(), properElements, "span");
		const logo = await this.commonUtils().getAssetFile(this.workerService(), "enhancer/logo-gray.svg");
		wrappers.forEach((element) => {
			element.style.order = SettingsButtonModule.ICONS_ORDER_MAP.ENHANCER_ICON;
			render(
				<TooltipComponent content={<p>Open Enhancer Settings</p>} position="bottom">
					<SettingsButtonComponent onClick={this.openSettings.bind(this)} logoUrl={logo} />
				</TooltipComponent>,
				element,
			);
		});
	}

	private setProperOrder(elements: Element[], key: string) {
		const order = SettingsButtonModule.ICONS_ORDER_MAP[key.toUpperCase()] ?? -1;
		elements.forEach((element) => {
			(element as HTMLElement).style.order = order.toString();
		});
	}

	private openSettings() {
		this.emitter.emit("extension:settings-open");
	}
}

const StyledSettingsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-medium);
  width: 30px;
  height: 30px;
  cursor: pointer;
  position: relative;
  margin-top: 4px;
	
  border: none;
  background: transparent;
  padding: 0;
  color: inherit;
	

  &:hover {
    background: var(--color-background-button-text-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus, #007bff);
    outline-offset: 2px;
  }
`;

interface SettingsButtonComponentProps {
	onClick: () => void;
	logoUrl: string;
}

function SettingsButtonComponent({ onClick, logoUrl }: SettingsButtonComponentProps) {
	return (
		<StyledSettingsButton onClick={onClick}>
			<img src={logoUrl} alt={"Enhancer Settings"} />
		</StyledSettingsButton>
	);
}
