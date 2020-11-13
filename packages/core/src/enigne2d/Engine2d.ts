import Engine from '../core/Engine';
import { IMAGE, updateImage } from './Image';
import { TEXT, updateText } from './Text';
import { Context2d } from './Context2d';

export default class Engine2d extends Engine {
	constructor(canvas: HTMLCanvasElement) {
		super(new Context2d(canvas));

		this.context.updateHandlers.set(IMAGE, updateImage);
		this.context.updateHandlers.set(TEXT, updateText);
	}

	update(time: number = 0) {
		const context2d = this.context as Context2d;
		context2d.context.fillRect(0, 0, context2d.width, context2d.height);
		super.update(time);
	}
}
