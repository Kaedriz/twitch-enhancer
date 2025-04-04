import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { version } from "./package.json";

const isDevelopment = process.env.ENVIRONMENT === "development";

export default defineConfig({
	server: {
		port: 3360,
		strictPort: true,
		watch: {
			usePolling: true,
		},
		cors: true, // TODO Change to allowed domains
	},
	define: {
		__environment__: JSON.stringify(process.env.ENVIRONMENT),
		__version__: JSON.stringify(version),
	},
	plugins: [preact(), tsconfigPaths()],
	build: {
		outDir: "dist",
		sourcemap: isDevelopment,
		minify: !isDevelopment,
		rollupOptions: {
			output: {
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
			},
			input: {
				index: "src/index.ts",
				inject: "src/inject.ts",
			},
		},
	},
});

// TODO Generate manifest.json from js file
