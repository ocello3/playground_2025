export const setParams = () => {
	const params = {};
	params.isPlay = false;
	params.scrLk = true;
	params.frameRate = 0;
	params.canvasDiv = document.getElementById('sketch');
	params.size = params.canvasDiv.clientWidth;
	params.mute = true;
	return params;
}

export const updateParams = (s, params) => {
	params.frameRate = s.frameRate();
}

const activate = (s, params, audio, seq) => {
	if (audio === true) Tone.Destination.mute = params.mute;
	if (seq === true) Tone.Transport.start();
	params.isPlay = true;
	s.loop();
}
const inactivate = (s, params, seq) => {
	if (seq === true) Tone.Transport.stop();
	params.isPlay = false;
	s.noLoop();
}
const reactivate = (s, params, seq) => {
	if (seq === true) Tone.Transport.start();
	params.isPlay = true;
	s.loop();
}

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

const startAudio = () => {
	const initAudioContext = () => {
		document.removeEventListener('touchstart', initAudioContext);
		Tone.start();
	}
	document.addEventListener('touchstart', initAudioContext);
}

export const gui = (s, params, audio=false, seq=false) => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	const tab = pane.addTab({
		pages: [
			{title: 'default'},
			{title: 'sketch'},
		],
	});
	tab.pages[0].addButton({ title: 'on/off', label: 'play' }).on('click', () => {
		const isInit = !s.isLooping() && !params.isPlay;
		const isPlay = s.isLooping();
		const isPause = !s.isLooping() && params.isPlay;
		if (isInit) activate(s, params, audio, seq);
		if (isPlay) inactivate(s, params, seq);
		if (isPause) reactivate(s, params, seq);
	});
	tab.pages[0].addMonitor(params, 'isPlay');
	tab.pages[0].addMonitor(params, 'frameRate', { interval: 500 });
	ban_scroll();
	tab.pages[0].addInput(params, 'scrLk').on('change', (event) => {
		if (event.value === true) {
			ban_scroll();
		}
		if (event.value === false) go_scroll();
	});
	if (audio === true) {
		startAudio();
		tab.pages[0].addInput(params, 'mute').on('change', (event) => {
			Tone.Destination.mute = event.value;
		});
	}
	return tab;
}
