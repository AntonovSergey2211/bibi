import { Engine } from '../core/engine';
import { Component } from './component';

type ComponentsMap = { [key: string]: Component };

export const CONTAINER = 'container';

export interface Container extends Component {
	children?: Component | Component[] | ComponentsMap;
}

export namespace Container {
	export function numChildren(container: Container): number {
		const { children } = container;
		if (children) {
			if (Array.isArray(children)) {
				return children.length;
			} if (children.type) {
				return 1;
			}
			const keys = Object.keys(children);
			return keys.length;
		}
		return 0;
	}
}

export namespace ContainerExtension {
	export function render(container: Container, engine: Engine): void {
		const { children } = container;
		const { renderer } = engine;

		if (children) {
			const context = renderer.getContext();
			renderer.depth++;

			if (Array.isArray(children)) {
				for (let i = 0; i < children.length; i++) {
					const component = children[i];
					renderer.renderComponent(component, context);
				}
			} else if (children.type) {
				const component = children as Container;
				renderer.renderComponent(component, context);
			} else {
				const componentsMap = children as ComponentsMap;
				const keys = Object.keys(componentsMap);
				for (let i = 0; i < keys.length; i++) {
					const component = componentsMap[keys[i]];
					renderer.renderComponent(component, context);
				}
			}

			renderer.depth--;
		}
	}

	export function update(container: Container, engine: Engine): void {
		const { children } = container;
		const { updater } = engine;

		if (children) {
			updater.depth++;

			if (Array.isArray(children)) {
				for (let i = 0; i < children.length; i++) {
					const component = children[i];
					updater.updateComponent(component);
				}
			} else if (children.type) {
				const component = children as Container;
				updater.updateComponent(component);
			} else {
				const componentsMap = children as ComponentsMap;
				const keys = Object.keys(componentsMap);
				for (let i = 0; i < keys.length; i++) {
					const component = componentsMap[keys[i]];
					updater.updateComponent(component);
				}
			}

			updater.depth--;
		}
	}

	export function hitTest(container: Container, engine: Engine): boolean {
		const { children } = container;
		const { pointerEvents } = engine;

		if (children) {
			const context = pointerEvents.getContext();
			pointerEvents.depth++;

			if (Array.isArray(children)) {
				for (let i = children.length - 1; i >= 0; i--) {
					const component = children[i];
					const result = pointerEvents.dispatchComponent(component, context);
					if (result) {
						return true;
					}
				}
			} else if (children.type) {
				const component = children as Container;
				const result = pointerEvents.dispatchComponent(component, context);
				if (result) {
					return true;
				}
			} else {
				const componentsMap = children as ComponentsMap;
				const keys = Object.keys(componentsMap);
				for (let i = keys.length - 1; i >= 0; i--) {
					const component = componentsMap[keys[i]];
					const result = pointerEvents.dispatchComponent(component, context);
					if (result) {
						return true;
					}
				}
			}

			pointerEvents.depth--;
		}
		return false;
	}

	export function init(engine: Engine) {
		engine.updater.components.set(CONTAINER, update);
		engine.renderer.components.set(CONTAINER, render);
		engine.pointerEvents.components.set(CONTAINER, hitTest);
	}
}
