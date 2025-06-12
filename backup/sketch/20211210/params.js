import { s } from './sketch.js';

export const setParams = () => {
	const params = {};
	// default
	params.isPlay = false;
	params.scrLk = false;
	params.frameRate = 0;
	params.canvasDiv = document.getElementById('sketch');
	params.size = params.canvasDiv.clientWidth;
	// sketch
	params.tmp = 0;
	return params;
}

export const testSetParams = (params) => {
	const isParamsSize = params.size > 0;
	console.assert(isParamsSize, params.size);
}

export const updateParams = (params) => {
	params.frameRate = s.frameRate();
}

export const setGui_params = (params, tab) => {
	// tab.pages[0].add~
	tab.pages[0].addSeparator();
	tab.pages[0].addInput(params, 'tmp');
}
