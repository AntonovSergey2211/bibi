import { RectangleData } from '../data/data';

export function applyRectangle(data: RectangleData, hasFill: boolean, context: CanvasRenderingContext2D): boolean {
	const {
		x = 0, y = 0,
		width = 0, height = 0,
	} = data;

	if (width === 0 || height === 0) {
		return false;
	}

	context.beginPath();

	context.rect(x, y, width, height);

	if (hasFill) {
		context.closePath();
	}
	return true;
}
