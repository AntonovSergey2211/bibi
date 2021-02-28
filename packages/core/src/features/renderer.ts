import { ColorTransform, Matrix } from '@e2d/geom';
import { Component } from '../components/component';
import { Engine } from '../core/engine';
import { Display } from '../interfaces/display';
import { Transform } from '../interfaces/transform';

export type RenderComponentHandler = (component: Component, engine: Engine) => void;

export interface RenderContext {
	matrix: Matrix;
	colorTransform: ColorTransform;
}

export class Renderer {
	readonly engine: Engine;
	readonly components = new Map<string, RenderComponentHandler>();

	depth = 0;
	enabled = true;

	private contexts: RenderContext[] = [];

	constructor(engine: Engine) {
		this.engine = engine;
	}

	getContext(): RenderContext {
		let context = this.contexts[this.depth];
		if (!context) {
			context = {
				matrix: Matrix.empty(),
				colorTransform: ColorTransform.empty(),
			};
			this.contexts[this.depth] = context;
		}
		return context;
	}

	renderComponent(component: Component, parent: RenderContext) {
		if (this.depth > this.engine.depth) {
			return;
		}

		if (!Display.isVisible(component)) {
			return;
		}

		const context = this.getContext();

		Transform.getMatrix(component, context.matrix);
		Transform.getColorTransform(component, context.colorTransform);

		Matrix.concat(parent.matrix, context.matrix, context.matrix);
		ColorTransform.concat(parent.colorTransform, context.colorTransform, context.colorTransform);

		const handler = this.components.get(component.type);
		if (handler) {
			handler(component, this.engine);
		}
	}

	render() {
		if (!this.enabled) {
			return;
		}

		const { root } = this.engine;
		if (!root) {
			return;
		}

		this.engine.platform.begin();

		this.depth = 0;
		const base = this.getContext();

		this.depth++;

		Matrix.copy(this.engine.screen.getMatrix(), base.matrix);
		ColorTransform.setEmpty(base.colorTransform);

		this.renderComponent(root, base);

		this.engine.platform.end();
	}
}
