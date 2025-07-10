import { KICK_DEFAULT_SETTINGS } from "$kick/kick.constants.ts";
import { Logger } from "$shared/logger/logger.ts";
import { TWITCH_DEFAULT_SETTINGS } from "$twitch/twitch.constants.ts";
import type { PlatformType } from "$types/shared/platform.types.ts";
import type { PlatformSettings, SettingsRecord } from "$types/shared/worker/settings-worker.types.ts";

export class SettingsDatabase {
	private readonly logger = new Logger({ context: "settings-db" });
	private database: IDBDatabase | null = null;
	private readonly dbName = "enhancer_settings";
	private readonly dbVersion = 1;
	private readonly storeName = "settings";

	private cache = new Map<PlatformType, PlatformSettings>();

	async initialize(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.dbVersion);

			request.onerror = () => {
				this.logger.error("Failed to open settings database:", request.error);
				reject(request.error);
			};

			request.onsuccess = () => {
				this.database = request.result;
				this.logger.info("Settings database loaded successfully");
				resolve();
			};

			request.onupgradeneeded = (event) => {
				this.handleUpgrade(event);
			};
		});
	}

	private handleUpgrade(event: IDBVersionChangeEvent): void {
		const db = (event.target as IDBOpenDBRequest).result;
		this.logger.info(`Creating settings database (version ${this.dbVersion})...`);

		const store = db.createObjectStore(this.storeName, { keyPath: "id" });
		store.createIndex("by_platform", "platform", { unique: true });
		store.createIndex("by_lastUpdate", "lastUpdate");
	}

	private getDefaultSettings(platform: PlatformType): PlatformSettings {
		switch (platform) {
			case "twitch":
				return TWITCH_DEFAULT_SETTINGS;
			case "kick":
				return KICK_DEFAULT_SETTINGS;
			default:
				throw new Error(`Unknown platform: ${platform}`);
		}
	}

	async getSettings<T extends PlatformSettings>(platform: PlatformType): Promise<T> {
		if (this.cache.has(platform)) {
			return this.cache.get(platform) as T;
		}

		if (!this.database) {
			throw new Error("Database not initialized");
		}

		return new Promise((resolve, reject) => {
			// biome-ignore lint/style/noNonNullAssertion: checking it above
			const tx = this.database!.transaction(this.storeName, "readonly");
			const store = tx.objectStore(this.storeName);
			const request = store.get(platform);

			request.onsuccess = () => {
				const result = request.result as SettingsRecord | undefined;
				const defaultSettings = this.getDefaultSettings(platform);

				const settings: PlatformSettings = result ? { ...defaultSettings, ...result.settings } : defaultSettings;

				this.cache.set(platform, settings);
				resolve(settings as T);
			};

			request.onerror = () => {
				this.logger.error("Failed to get settings:", request.error);
				reject(request.error);
			};
		});
	}

	async updateSettings(platform: PlatformType, settings: PlatformSettings): Promise<void> {
		if (!this.database) {
			throw new Error("Database not initialized");
		}

		const now = Date.now();
		const settingsRecord: SettingsRecord = {
			id: platform,
			platform,
			settings,
			lastUpdate: now,
		};

		return new Promise((resolve, reject) => {
			// biome-ignore lint/style/noNonNullAssertion: checking it above
			const tx = this.database!.transaction(this.storeName, "readwrite");
			const store = tx.objectStore(this.storeName);
			const request = store.put(settingsRecord);

			request.onsuccess = () => {
				this.cache.set(platform, settings);
				this.logger.debug(`Settings updated for platform: ${platform}`);
				resolve();
			};

			request.onerror = () => {
				this.logger.error("Failed to update settings:", request.error);
				reject(request.error);
			};
		});
	}
}
