const setSynthParams = (params, tab) => {
	params.synth = {
		sampleVolume: -5,
		ocillatorVolume: {
			min: -25,
			max: -3,
		},
		freqArray: ['E4', 'G4', 'Bb4', 'E5'],
	};
	tab.pages[2].addInput(params.synth, 'sampleVolume', { step: 1, min: -60, max: 0 });
	return false;
}

const setSampler = () => {
	return new Tone.Sampler({
		urls: {
			A0: 'caution.wav',
			A1: 'swipe_01.wav',
		},
		baseUrl: '../../sound/SND02_piano/',
	}).toDestination();
}

const setOcillatorArray = (params) => Array.from(Array(params.checkbox.blockNum), () => {
	const ocillator = {};
	ocillator.pan = new Tone.Panner(0).toDestination();
	ocillator.synth = new Tone.AMOscillator(30, "sine", "square").connect(ocillator.pan);
	return ocillator;
});

export const setSynth = (params, tab) => {
	setSynthParams(params, tab);
	const synth = {};
	synth.sampler = setSampler();
	synth.sampler.volume.value = params.synth.sampleVolume;
	synth.ocillatorArray = setOcillatorArray(params);
	return synth;
}

export const playSynth = (textObj, checkboxObj, synth, params, s) => {
	const playSampler = () => {
		if (textObj.isReset) {
			synth.sampler.triggerAttackRelease('A1', '32n');
			return false;
		} else if (textObj.isInit || textObj.isOver) {
			synth.sampler.triggerAttackRelease('A0', '32n');
			return false;
		}
	}
	playSampler();
	const initOcillator = () => {
		for (const ocillator of synth.ocillatorArray) { ocillator.synth.start(); }
	}
	if (s.frameCount === 2 && !params.mute) initOcillator();
	const playOcillator = () => {
		synth.ocillatorArray.forEach((ocillator, ocillatorIndex) => {
			const checkboxBlock = checkboxObj.checkboxBlocks[ocillatorIndex];
			const volume = s.map(checkboxBlock.checkedRate, 0, 1, params.synth.ocillatorVolume.min, params.synth.ocillatorVolume.max);
			const freq = params.synth.freqArray[checkboxBlock.id.y];
			ocillator.synth.volume.value = volume;
			ocillator.synth.frequency.value = freq;
			ocillator.pan.pan.value = s.map(checkboxBlock.checkedAveragePos.x, 0, params.size, -1, 1);
			ocillator.synth.harmonicity.value = s.map(checkboxBlock.checkedAveragePos.y, 0, params.size, 1, 3);
		});
	}
	if (s.frameCount > 2) playOcillator();
}
