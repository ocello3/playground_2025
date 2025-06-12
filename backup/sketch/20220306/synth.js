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

export const setSynth = () => {
	const synth = {};
	synth.monoSynth = setMonoSynth();
	synth.monoSynth2 = setMonoSynth();
	synth.loop = new Tone.Loop((time) => {
		synth.monoSynth2.triggerAttackRelease("E6", "16n");;
	}, "4n").start(0);
	return synth;
}

export const playSynth = (ball, synth) => {
	if (ball.sound === true) synth.monoSynth.triggerAttackRelease("C4", "8n");
}
