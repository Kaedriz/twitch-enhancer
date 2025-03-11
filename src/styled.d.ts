import "styled-components";
import type { ComponentChildren } from "preact";

declare module "styled-components" {
	interface StyledComponentProps {
		children?: ComponentChildren;
	}

	// Apply the fix globally to all styled-components
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	type StyledComponent<P = {}> = import("styled-components").StyledComponent<
		"any",
		DefaultTheme,
		P & StyledComponentProps,
		never
	>;
}
