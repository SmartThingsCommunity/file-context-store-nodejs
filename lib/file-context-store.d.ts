export interface ContextObject {
	installedAppId: string;
	locationId: string
	locale: string;
	authToken: string;
	refreshToken: string;
	config: any;
	state: any;
}

export interface FileContextStore {
	get(installedAppId: string): Promise<ContextObject>;
	put(installedAppId: string, context: ContextObject): Promise<void>;
	update(installedAppId: string, context: Partial<ContextObject>): Promise<void>;
	delete(installedAppId: string): Promise<void>;
	getItem(installedAppId: string, key: string): Promise<any>;
	putItem(installedAppId: string, key: string, value: any): Promise<void>;
	removeItem(installedAppId: string, key: string): Promise<void>;
	removeAllItems(installedAppId: string): Promise<void>;
}
