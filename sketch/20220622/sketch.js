import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { attractor } from './attractor.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let attractorObj;
	let tab;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		// s.blendMode(s.OVERLAY);
		tab = gui(s, params, false, false); // audio, seq
		// tab.pages[0].addInput(params, 'margin');
		attractorObj = attractor.init(params, s, tab);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(33, 11, 44, 200);
		// text
		attractorObj = attractor.update(attractorObj, params, s);
		attractor.draw(attractorObj, params, s);
		// debug(attractorObj);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(attractorObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
