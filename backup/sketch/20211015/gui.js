export const gui = params => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	pane.addInput(params, 'noiseZ_max', {
		min: 0, max: 5, step: 0.1
	});
}