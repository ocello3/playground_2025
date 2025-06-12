const startAudio = () => {
	const initAudioContext = () => {
		document.removeEventListener('touchstart', initAudioContext);
		Tone.start();
	}
	document.addEventListener('touchstart', initAudioContext);
}

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

export const setSynth = (params, tab) => {
	// setting
	startAudio();
	params.mute = false;
	tab.pages[0].addInput(params, 'mute').on('change', (event) => {
		Tone.Destination.mute = event.value;
	});
	const synth = {};
	synth.monoSynth = setMonoSynth();
	return synth;
}
