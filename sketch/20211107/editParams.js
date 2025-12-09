import { s } from './sketch.js';

export const addParams = (params) => {
	params.num = 40;
	params.noiseZ_min = 0.2;
	params.noiseZ_max = 1;
	params.speedRate = 0.01;
	params.dist_max = params.size*2/5;
	params.circleSize_base = 0.985;
	params.circleSize_mult = 60;
	return false;
}

export const addGui = (tab, params) => {
	tab.pages[0].addInput(params, 'noiseZ_max', {
		min: 0, max: 5, step: 0.1
	});
	tab.pages[0].addInput(params, 'circleSize_base', {
		min: 0.900, max: 0.999
	});
	tab.pages[0].addInput(params, 'circleSize_mult', {
		min: 40, max: 80
	});
	tab.pages[0].addMonitor(params, 'frameRate', {interval: 500});
}
