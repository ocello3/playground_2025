import { s } from './sketch.js';

export const setParams = (params) => {
	// scroll setting for ios safari
	window.onscroll = function () {
		if (document.body.scrollHeight == window.innerHeight + window.pageYOffset) {
			window.focus();
		}
	}
	// set params
	params.isPlay = false;
	params.frameRate = 0;
	params.canvasDiv = document.getElementById('sketch');
	params.size = params.canvasDiv.clientWidth;
	params.scrollTop = 0;
	params.scrollmax = 200;
	params.multRate = 1;
	// font info
	params.text = 'Sketch List';
	params.fontSize = params.size/params.text.length*2;
	params.sampleFactor = 1;
	params.simplifyThreshold = 0;
	params.outlineStep = 1;
}

export const testSetParams = (params) => {
	const isParamsSize = params.size > 0;
	console.assert(isParamsSize, params.size);
}

export const updateParams = (params) => {
	params.frameRate = s.frameRate();
	params.scrollTop = params.canvasDiv.scrollTop || document.body.scrollTop || window.pageYOffset;
	params.multRate = (params.scrollmax - params.scrollTop) / params.scrollmax; // top: 1, bottom: 0
	params.outlineStep = Math.round(Math.sin(s.frameCount/100)*150);
}	

const activate = (params) => {
	// synths.forEach(synth => synth.start();
	// Tone.start(); // remove after add synths
	// Tone.Transport.start();
	params.isPlay = true;
	s.loop();
}

const inactivate = (params) => {
	// Tone.Destination.mute = true;
	// Tone.Transport.stop();
	params.isPlay = false;
	s.noLoop();
}
const reactivate = (params) => {
	// Tone.Destination.mute = false;
	// Tone.Transport.start();
	params.isPlay = true;
	s.loop();
}

export const gui = (params) => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	const tab = pane.addTab({
		pages: [
			{title: 'default'},
			{title: 'detail'},
		],
	});
	const playBtn = tab.pages[0].addButton({ title: 'on/off' , label: 'play'});
	playBtn.on('click', () => {
		const isInit = !s.isLooping() && !params.isPlay;
		const isPlay = s.isLooping();
		const isPause = !s.isLooping() && params.isPlay;
		if (isInit) activate(params);
		if (isPlay) inactivate(params);
		if (isPause) reactivate(params);
	});
	tab.pages[0].addMonitor(params, 'isPlay');
	tab.pages[0].addMonitor(params, 'frameRate', { interval: 500 });
	tab.pages[1].addMonitor(params, 'scrollTop', { interval: 500 });
	tab.pages[0].addMonitor(params, 'outlineStep', { interval: 500 });
}
