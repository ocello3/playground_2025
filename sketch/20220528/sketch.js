import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { line } from './line.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let lineObj;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		const tab = gui(s, params, false, false); // audio, seq
		// tab.pages[0].addInput(params, 'margin');
		line.setParams(params, tab);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		// text
		lineObj = line.calc(lineObj, params, s);
		line.draw(lineObj, params, s);
		// debug(lineObj);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(textObj, checkboxObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
