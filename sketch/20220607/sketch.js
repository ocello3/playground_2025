import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { walker } from './walker.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let walkerObj;
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		s.colorMode(s.HSP);
		const tab = gui(s, params, false, false); // audio, seq
		// tab.pages[0].addInput(params, 'margin');
		walkerObj = walker.init(params, s, tab);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
		s.background(255);
	};
	s.draw = () => {
		// s.background(255, 100);
		// text
		walkerObj = walker.update(walkerObj, params, s);
		walker.draw(walkerObj, params, s);
		// debug(walkerObj);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(walkerObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
