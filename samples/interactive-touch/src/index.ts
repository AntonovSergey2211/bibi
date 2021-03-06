import { CanvasImageExtension, Image } from '@jeng/image';
import { CanvasEngine } from '@jeng/canvas-engine';
import { Container, PointerEvent, ComponentsMap } from '@jeng/core';
import { TouchExtension } from '@jeng/web';

// create engine
const engine = new CanvasEngine();
// add image extension
CanvasImageExtension.init(engine);
// add mouse extension
TouchExtension.init(engine);
// set fullscreen mode
engine.screen.fullscreen = true;
// start update loop
engine.ticker.play();
// add engine view to page
document.body.appendChild(engine.platform.view);

interface CustomImage extends Image {
	pointerX: number;
	pointerY: number;
	pointerId: number;
	onParentPointerMove(e: PointerEvent): void;
	onParentPointerUp(e: PointerEvent): void;
}

// images list
const images = [
	'eyeFayball.png',
	'fayball1.png',
	'fayball3.png',
	'fireFayball.png',
	'voidFayball.png',
];

const border = 100;

// container width images
const imagesContainer: Container = {
	type: 'container',
	children: images.map((image) => ({
		type: 'image',
		src: `assets/${image}`,
		x: border + Math.random() * (engine.screen.getWidth() - border * 2),
		y: border + Math.random() * (engine.screen.getHeight() - border * 2),
		pivotX: 0.5,
		pivotY: 0.5,
		pointerX: 0,
		pointerY: 0,
		pointerId: -1,
		pointerTestShape: true,
		onPointerDown(e) {
			this.pointerX = e.globalX;
			this.pointerY = e.globalY;
			this.pointerId = e.id!;
		},
		onParentPointerMove(e) {
			if (this.pointerId === e.id) {
				this.x! += e.globalX - this.pointerX;
				this.y! += e.globalY - this.pointerY;
				this.pointerX = e.globalX;
				this.pointerY = e.globalY;
			}
		},
		onParentPointerUp(e) {
			if (this.pointerId === e.id) {
				this.pointerId = -1;
			}
		},
	} as CustomImage)),
};

// create container with image
engine.root = {
	type: 'container',
	children: {
		background: {
			type: 'image',
			src: 'assets/cave_background.jpg',
		},
		imagesContainer,
	},
	onPointerMove(e) {
		const { imagesContainer: container } = this.children as ComponentsMap;
		const children = (container as Container).children as CustomImage[];
		children.forEach((image) => image.onParentPointerMove(e));
	},
	onPointerUp(e) {
		const { imagesContainer: container } = this.children as ComponentsMap;
		const children = (container as Container).children as CustomImage[];
		children.forEach((image) => image.onParentPointerUp(e));
	},
} as Container;
