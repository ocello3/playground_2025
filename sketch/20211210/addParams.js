import { s } from './sketch.js';

export const addParams = (params) => {
	params.tmp = 0;
	return false;
}

export const addGui = (params, tab) => {
	// tab.pages[0].add~
	tab.pages[0].addSeparator();
	tab.pages[0].addInput(params, 'tmp');
}
