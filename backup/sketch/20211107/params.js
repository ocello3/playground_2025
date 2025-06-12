import { s } from './sketch.js';

export const setParams = () => {
	const canvasDiv = document.getElementById('sketch');
	return {
		num: 40,
		size: canvasDiv.clientWidth,
		frameCount: 0,
		noiseZ_min: 0.2,
		noiseZ_max: 1,
		speedRate: 0.01,
		dist_max: canvasDiv.clientWidth*2/5,
		frameRate: 0,
		circleSize_base: 0.985,
		circleSize_mult: 60,
	}
}

export const updateParams = (params) => {
	params.frameCount += 1;
	params.frameRate = s.frameRate();
}

export const gui = params => {
	const pane = new Tweakpane.Pane({ container: document.getElementById('pane') });
	pane.addInput(params, 'noiseZ_max', {
		min: 0, max: 5, step: 0.1
	});
	pane.addInput(params, 'circleSize_base', {
		min: 0.900, max: 0.999
	});
	pane.addInput(params, 'circleSize_mult', {
		min: 40, max: 80
	});
	pane.addMonitor(params, 'frameRate', {interval: 500});
}
