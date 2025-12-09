import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setCircleParams, calcCircleObj, drawCircleObj } from './circle.js';
import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let circleObj = { isInit: true };
	let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		// tab.pages[0].addInput(params, 'margin');
		const tab = gui(s, params, true, false); // audio, seq
		setCircleParams(params, tab);
		synth = setSynth(params, tab);
		s.noLoop();
		// s.frameRate(10);
	};
	s.draw = () => {
		s.background(255);
		drawFrame(s, params);
		circleObj = calcCircleObj(circleObj, params, s,);
		// debug(circleObj);
		drawCircleObj(circleObj, s);
		updateParams(s, params);
		playSynth(circleObj, synth, params, s);
	};
}
new p5(sketch, 'sketch');
