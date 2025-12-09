const setMonoSynth = () => {
	return new Tone.MonoSynth({
		oscillator: {
			type: "square"
		},
		envelope: {
			attack: 0.1
		}
	}).toDestination();
}

const setSampler = () => {
	return new Tone.Sampler({
		urls: {
			A1: 'select.wav',
			A2: 'progress_loop.wav',
		},
		baseUrl: '../../sound/SND01_sine/',
	}).toDestination();
}

export const setSynth = () => {
	const synth = {};
	synth.monoSynth = setMonoSynth(); // 日本語フォントのテスト
	synth.sampler = setSampler();
	/*
	synth.loop = new Tone.Loop((time) => {
		synth.monoSynth2.triggerAttackRelease("E6", "16n");
	}, "4n").start(0);
	*/
	return synth;
}

export const playSynth = (balls, synth) => {
	if (balls.isUpdate === true & balls.isRefresh === false) synth.sampler.triggerAttackRelease("A1", "8n");
	if (balls.isRefresh === true) synth.sampler.triggerAttackRelease("A2", "8n");
}
