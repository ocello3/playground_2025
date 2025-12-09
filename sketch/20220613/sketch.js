import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { flooder } from './flooder.js';
import { bubble } from './bubble.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let flooderObj;
	let bubbleObj;
	// let synth;
	s.preload = () => {
		params = setParams();
		params.font = s.loadFont('../../font/Fascinate-Regular.ttf');
	}
	s.setup = () => {
		s.createCanvas(params.size, params.size);
		const tab = gui(s, params, false, false); // audio, seq
		// tab.pages[0].addInput(params, 'margin');
		flooderObj = flooder.init(params, s, tab);
		bubbleObj = bubble.init(flooderObj, params, s, tab);
		// synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
		s.background(255);
	};
	s.draw = () => {
		s.background(255);
		// text
		flooderObj = flooder.update(flooderObj, params, s);
		bubbleObj = bubble.update(flooderObj, bubbleObj, params, s);
		flooder.draw(flooderObj, params, s);
		bubble.draw(bubbleObj, params, s);
		// debug(bubbleObj);
		drawFrame(s, params);
		updateParams(s, params);
		// playSynth(flooderObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
