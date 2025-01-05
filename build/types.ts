export type BundlerConfig = {
	build: {
		publicPath: string;
		sourcePath: string;
		entryPointsPath: string[];
		distributionPath: string;
	};
	server: {
		port: number;
	};
};

export type BuildType = "production" | "development";
