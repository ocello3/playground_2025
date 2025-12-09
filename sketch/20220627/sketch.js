import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { arrow } from './arrow.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let arrowObj;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		const tab = gui(s, params, false, false); // audio, seq
		// tab.pages[0].addInput(params, 'margin');
		arrow.set(params, s, tab);
		arrowObj = arrow.init(params, s);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		// text
		arrowObj = arrow.update(arrowObj, params, s);
		arrow.draw(arrowObj, params, s);
		// debug(arrowObj.arrows[0]);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(arrowObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
