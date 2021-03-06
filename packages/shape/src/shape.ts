import { Component, Engine, Pivot } from '@jeng/core';
import { Bounds, Rectangle } from '@jeng/geom';
import { ImageResource } from '@jeng/resources';
import { GraphicsData } from './data/data';

export const SHAPE = 'shape';

export interface Shape extends Component, Pivot {
	data?: GraphicsData | GraphicsData[];
}

const bounds = Bounds.empty();

export namespace Shape {
	export function calculateBounds(shape: Shape, result: Rectangle) {
		const { data } = shape;
		if (!data) {
			Rectangle.setEmpty(result);
			return;
		}

		Bounds.setEmpty(bounds);

		if (Array.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				GraphicsData.calculateBounds(data[i], bounds);
			}
		} else if (typeof data === 'object') {
			GraphicsData.calculateBounds(data, bounds);
		} else {
			Rectangle.setEmpty(result);
			return;
		}

		if (Bounds.isEmpty(bounds)) {
			Rectangle.setEmpty(result);
			return;
		}

		const width = bounds.maxX - bounds.minX;
		const height = bounds.maxY - bounds.minY;
		const x = bounds.minX + Pivot.getX(shape, width);
		const y = bounds.minY + Pivot.getY(shape, height);

		result.x = x;
		result.y = y;
		result.width = width;
		result.height = height;
	}
}

const rectangle = Rectangle.empty();

export namespace ShapeExtension {
	export function hitTest(shape: Shape, engine: Engine): boolean {
		const { local } = engine.pointers;
		Shape.calculateBounds(shape, rectangle);
		return Rectangle.contains(rectangle, local);
	}

	export function init(engine: Engine) {
		engine.components.hitTest.set(SHAPE, hitTest);
		ImageResource.init(engine);
	}
}
