import { s } from './sketch.js';

// p5js start/stop
const activate = (params) => {
	Tone.start();
	Tone.Destination.mute = params.mute;
	// Tone.Transport.start();
	params.isPlay = true;
	s.loop();
}
const inactivate = (params) => {
	// Tone.Transport.stop();
	params.isPlay = false;
	s.noLoop();
}
const reactivate = (params) => {
	// Tone.Transport.start();
	params.isPlay = true;
	s.loop();
}

// scroll lock
const ban_scroll = () => {
	document.addEventListener("wheel", notscroll, { passive: false }); // pc
	document.addEventListener("touchmove", notscroll, { passive: false }); // touch
	document.addEventListener("dblclick", notscroll, { passive: false }); // expand
}
const go_scroll = () => {
	document.removeEventListener("wheel", notscroll, { passive: false }); // pc
	document.removeEventListener("touchmove", notscroll, { passive: false }); // touch
	document.removeEventListener("dblclick", notscroll, { passive: false }); // expand
}
const notscroll = (e) => {
	e.preventDefault();
}

// set gui
export const gui = (params) => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	// create tab
	const tab = pane.addTab({
		pages: [
			{title: 'default'},
			{title: 'sketch'},
		],
	});
	// set default tab
	tab.pages[0].addButton({ title: 'on/off', label: 'play' }).on('click', () => {
		const isInit = !s.isLooping() && !params.isPlay;
		const isPlay = s.isLooping();
		const isPause = !s.isLooping() && params.isPlay;
		if (isInit) activate(params);
		if (isPlay) inactivate(params);
		if (isPause) reactivate(params);
	});
	tab.pages[0].addMonitor(params, 'isPlay');
	tab.pages[0].addMonitor(params, 'frameRate', { interval: 500 });
	tab.pages[0].addInput(params, 'scrLk').on('change', (event) => {
		if (event.value === true) {
			ban_scroll();
		}
		if (event.value === false) go_scroll();
	});
	// export
	return tab;
}
