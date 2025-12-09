import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setCheckboxParams, calcCheckboxObj, updateCheckboxDoms } from './checkbox.js';
import { setTextParams, calcTextObj, drawText } from './text.js';
import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let checkboxObj = { isInit: true };
	let textObj = { isInit: true };
	let checkboxDoms;
	let pg;
	let pgMask;
	let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		const tab = gui(s, params, true, false); // audio, seq
		pg = s.createGraphics(params.size, params.size);
		pgMask = s.createGraphics(params.size, params.size);
		// tab.pages[0].addInput(params, 'margin');
		setTextParams(params, tab);
		setCheckboxParams(params, tab);
		// checkboxDoms = Array.from(Array(Math.pow(params.checkbox.pieceNum, 2)), () => s.createCheckbox());
		// checkboxDoms.forEach(checkboxDom => checkboxDom.style('transform', `scale(${params.checkbox.sizeRate * params.size})`));
		synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		// text
		textObj = calcTextObj(textObj, params, s);
		drawText(textObj, pg, params);
		// s.image(pg, 0, 0, params.size, params.size);
		// checkbox
		checkboxObj = calcCheckboxObj(checkboxObj, pg, params, s);
		updateCheckboxDoms(pgMask, checkboxDoms, checkboxObj, params, s);
		// debug(checkboxObj.checkboxBlocks);
		// template
		drawFrame(s, params);
		updateParams(s, params);
		playSynth(textObj, checkboxObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
