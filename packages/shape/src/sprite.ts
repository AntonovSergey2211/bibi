import { Container } from '@e2d/display';
import { IRenderingContext } from '@e2d/render';
import Graphics from './graphics';
import GraphicsRenderer from './graphics-renderer';

export default class Sprite extends Container {
	readonly graphics = new Graphics();

	constructor() {
		super();
	}

	renderContent(context: IRenderingContext) {
		GraphicsRenderer.render(
			context,
			this.transform.concatenatedMatrix,
			this.transform.concatenatedColorTransform,
			this.graphics,
		);

		super.renderContent(context);
	}
}
