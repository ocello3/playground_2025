import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { mover } from './mover.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let moverObj;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		s.colorMode(s.HSP);
		const tab = gui(s, params, false, false); // audio, seq
		// tab.pages[0].addInput(params, 'margin');
		moverObj = mover.init(params, s, tab);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
		s.background(255);
	};
	s.draw = () => {
		// s.background(255, 2);
		// text
		moverObj = mover.update(moverObj, params, s);
		mover.draw(moverObj, params, s);
		// debug(moverObj);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(moverObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
