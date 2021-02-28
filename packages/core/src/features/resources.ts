export interface Resource {
	asset: string;
	loaded: boolean;
}

export type ResourceResolver = (asset: string) => Resource | null;

export class Resources {
	readonly resources = new Map<any, any>();
	readonly resolvers = new Set<ResourceResolver>();

	get(asset: string): Resource | null {
		if (!asset) {
			return null;
		}

		let resource = this.resources.get(asset);
		if (!resource) {
			resource = this.resolve(asset);
			this.resources.set(asset, resource);
		}

		return resource;
	}

	private resolve(asset: string): Resource | null {
		// eslint-disable-next-line no-restricted-syntax
		for (const resolver of this.resolvers) {
			const resource = resolver(asset);
			if (resource) {
				return resource;
			}
		}
		// Debug.warning(`Resource not resolved: ${asset}`);
		return null;
	}
}