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
	params.touchedXPos = 0;
	params.touchedYPos = 0;
	params.touchedEasingFactor = 0.7;
	params.releasedEasingFactor = 0.2;
	return params;
}

export const testSetParams = (params) => {
	const isParamsSize = params.size > 0;
	console.assert(isParamsSize, params.size);
}

export const updateParams = (params) => {
	params.frameRate = s.frameRate();
	const touchedPos = s.touches[0];
	params.touchedXPos = (s.touches.length === 0) ? 0 : touchedPos.x;
	params.touchedYPos = (s.touches.length === 0) ? 0 : touchedPos.y;
	params.mouseY = s.mouseY;
}

export const setGui_params = (params, tab) => {
	// tab.pages[0].add~
	tab.pages[0].addSeparator();
	tab.pages[0].addMonitor(params, 'touchedXPos');
	tab.pages[0].addMonitor(params, 'touchedYPos');
}
