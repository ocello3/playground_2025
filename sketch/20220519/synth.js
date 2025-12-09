const setSoundParams = (params, tab) => {
	params.sound = {
		minVolume: -45,
		maxVolume: -25,
	};
	tab.pages[2].addInput(params.sound, 'minVolume', {step: 1, min: -60, max: 0});
	tab.pages[2].addInput(params.sound, 'maxVolume', {step: 1, min: -60, max: 0});
	return false;
}
const tapSamplerPanner = new Tone.Panner(0).toDestination();

const setTapSampler = (tapSamplerPanner) => {
	return new Tone.Sampler({
		urls: {
			A0: 'tap_01.wav',
			A1: 'tap_02.wav',
			A2: 'tap_03.wav',
			A3: 'tap_04.wav',
			A4: 'tap_05.wav',
		},
		baseUrl: '../../sound/SND01_sine/',
	}).connect(tapSamplerPanner);
}

const sinSamplerPanner = new Tone.Panner(0).toDestination();

const setSinSampler = (sinSamplerPanner) => {
	return new Tone.Sampler({
		urls: {
			A0: 'transition_down.wav',
			A1: 'transition_up.wav',
		},
		baseUrl: '../../sound/SND01_sine/',
	}).connect(sinSamplerPanner);
}

export const setSynth = (params, tab) => {
	setSoundParams(params, tab);
	const synth = {};
	synth.tapSamplerPanner = tapSamplerPanner;
	synth.tapSampler = setTapSampler(synth.tapSamplerPanner);
	synth.sinSamplerPanner = sinSamplerPanner;
	synth.sinSampler = setSinSampler(synth.sinSamplerPanner);
	return synth;
}

export const playSynth = (circleObj, synth, params, s) => {
	if (circleObj.isUpdateTargetMousePos) {
		const pan = s.map(circleObj.currentMousePos.x, 0, params.size, -1, 1);
		synth.sinSamplerPanner.pan.value = pan;
		const volume = s.map(circleObj.currentMousePos.y, 0, params.size, params.sound.minVolume, params.sound.maxVolume) * 0.6;
		synth.sinSampler.volume.value = volume; // grid.circleOffset
		if (circleObj.currentMousePos.y < circleObj.targetMousePos.y) {
			synth.sinSampler.triggerAttackRelease('A0', '32n');
		} else {
			synth.sinSampler.triggerAttackRelease('A1', '32n');
		}
	}
	for (const grid of circleObj.grids) {
		if (grid.isUpdateTargetAngle) {
			const pan = s.map(grid.centerPos.x, 0, params.size, -1, 1);
			synth.tapSamplerPanner.pan.value = pan;
			const volume = s.map(circleObj.currentMousePos.y, 0, params.size, params.sound.minVolume, params.sound.maxVolume);
			synth.tapSampler.volume.value = volume; // grid.circleOffset
			if (grid.id.y === 0) { synth.tapSampler.triggerAttackRelease('A0', '32n'); return false; } 
			if (grid.id.y === 1) { synth.tapSampler.triggerAttackRelease('A1', '32n'); return false; }
			if (grid.id.y === 2) { synth.tapSampler.triggerAttackRelease('A2', '32n'); return false; }
			if (grid.id.y === 3) { synth.tapSampler.triggerAttackRelease('A3', '32n'); return false; }
			if (grid.id.y === 4) { synth.tapSampler.triggerAttackRelease('A4', '32n'); return false; }
			throw grid.id.y;
		}
	};
}
