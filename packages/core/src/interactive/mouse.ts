import { Engine } from '../core/engine';
import { PointerEventType } from '../extensions/pointer';

function dispatchEvent(engine: Engine, event: MouseEvent, type: PointerEventType) {
	const { view } = engine.platform;
	const clientRect = view.getBoundingClientRect();
	const x = event.clientX - clientRect.left - view.clientLeft;
	const y = event.clientY - clientRect.top - view.clientTop;
	engine.pointers.dispatch(type, x, y, 0);
	event.preventDefault();
}

export namespace MouseExtension {
	export function init(engine: Engine) {
		const { view } = engine.platform;

		view.addEventListener('mousedown', (event: MouseEvent) => {
			dispatchEvent(engine, event, 'pointerDown');
		});

		view.addEventListener('mouseup', (event: MouseEvent) => {
			dispatchEvent(engine, event, 'pointerUp');
		});

		view.addEventListener('mousemove', (event: MouseEvent) => {
			dispatchEvent(engine, event, 'pointerMove');
		});

		view.addEventListener('mouseleave', (event: MouseEvent) => {
			dispatchEvent(engine, event, 'pointerCancel');
		});
	}
}
