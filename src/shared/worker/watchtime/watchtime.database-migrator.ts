import type { Logger } from "$shared/logger/logger.ts";
import type { PlatformType } from "$types/shared/platform.types.ts";

export class WatchtimeDatabaseMigrator {
	constructor(
		private readonly storeName: string,
		private readonly logger: Logger,
	) {}

	migrate(event: IDBVersionChangeEvent, db: IDBDatabase, newVersion: number): void {
		this.logger.info(`Upgrading watchtime database from version ${event.oldVersion} to ${newVersion}...`);

		if (event.oldVersion < 1) {
			const store = db.createObjectStore(this.storeName, { keyPath: "id" });
			store.createIndex("by_platform", "platform");
			store.createIndex("by_username", "username");
			store.createIndex("by_platform_username", ["platform", "username"], {
				unique: true,
			});
			store.createIndex("by_time", "time");
		}

		if (event.oldVersion < 2) {
			const request = event.target as IDBOpenDBRequest;
			const tx = request.transaction;
			if (!tx) {
				throw new Error("No transaction available during upgrade");
			}
			const store = tx.objectStore(this.storeName);
			store.createIndex("by_platform_time", ["platform", "time"]);
			this.logger.info("Added index: by_platform_time");
		}

		if (event.oldVersion < 3) {
			const request = event.target as IDBOpenDBRequest;
			const tx = request.transaction;
			if (!tx) {
				throw new Error("No transaction available during upgrade");
			}
			const store = tx.objectStore(this.storeName);
			const index = store.index("by_username");

			const cursorRequest = index.openCursor("videos");
			cursorRequest.onsuccess = () => {
				const cursor = cursorRequest.result;
				if (cursor) {
					this.logger.info(`Deleting watchtime record for user "videos" (id: ${cursor.primaryKey})`);
					cursor.delete();
					cursor.continue();
				}
			};
			cursorRequest.onerror = () => {
				this.logger.error("Failed to remove user 'videos' during migration:", cursorRequest.error);
			};
		}
	}
}
