import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setLineParams, setLinePgs, setLinesMap, updateLinesMap, drawLinePgs } from './line.js';
// import { setSynth, playSynth } from './synth.js';

const sketch = s => {
	let params; // size
	let linesMap;
	let pgs = {};
	// let synth;
	s.setup = () => {
		params = setParams();
		s.createCanvas(params.size, params.size);
		// tab.pages[0].addInput(params, 'margin');
		const tab = gui(s, params, false, false); // audio, seq
		setLineParams(params);
		setLinePgs(params, pgs, s);
		linesMap = setLinesMap(params, s);
		// synth = setSynth();
		s.noLoop();
		// s.frameRate(2);
	};
	s.draw = () => {
		s.background(255);
		drawLinePgs(params, pgs.lines, linesMap, s);
		// debug(linesMap.get('above').get('full'), 3, 20);
		drawFrame(s, params);
		updateParams(s, params);
		linesMap = updateLinesMap(linesMap, s, params);
		// playSynth(balls, synth);
	};
}
new p5(sketch, 'sketch');
