import { Entity, isEnabled } from './Entity';

type UpdateHandler = (entity: Entity, context: Context) => void;

export interface ContextState {
}

export abstract class Context {
	time = 0;

	readonly updateHandlers = new Map<string, UpdateHandler>();

	state: ContextState = {};

	update(entity: Entity) {
		if (isEnabled(entity)) {
			const updateHandler = this.updateHandlers.get(entity.type);
			if (updateHandler) {
				updateHandler(entity, this);
			}
		}
	}

	abstract getState(entity: Entity): ContextState;
}