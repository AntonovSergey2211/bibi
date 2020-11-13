import {
	Text, Image, Container, Transform,
} from '@e2d/core';

interface Header extends Container, Transform {
	update(): void;
}

interface HeaderProperties {
	title: string,
	onClick: () => void;
}

export default function header(props: HeaderProperties): Header {
	const component: Header = {
		type: 'container',
		x: 100,
		y: 50,
		children: [
			{
				type: 'text',
				text: props.title,
				onClick: props.onClick,
				x: 10,
				y: 20,
				scaleX: 2,
			} as Text,
			{
				type: 'image',
				src: 'logo.png',
				x: 1,
				y: 2,
				rotation: 0.1,
			} as Image,
		],
		update() {
			if (this.children) {
				const image = this.children[1] as Image;
				if (image && image.rotation) {
					image.rotation += 0.01;
				}
			}
		},
	};
	return component;
}
