import { setParams, updateParams, gui } from '../../util/params.js';
import { addParams, addGui } from './addParams.js';
import { setSynth } from './synth.js';

let params;
let synth;
let tempNum = 0;

const thisSetup = s => {
	params = setParams();
	addParams(params);
	const tab = gui(s, params, true, false); // audio, seq
	addGui(params, tab);
	synth = setSynth(params, tab);
	s.createCanvas(params.size, params.size);
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	s.background(255);
	// update
	updateParams(s, params);
	// draw frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size, params.size);
	s.pop();
	// draw num for test
	if (s.frameCount % 60 === 0) {
		tempNum += 1;
		synth.monoSynth.triggerAttackRelease("C4", "16n");
	}
	s.textSize(params.size / 4);
	s.textAlign(s.CENTER, s.CENTER);
	s.text(tempNum, s.width / 2, s.height / 2);
	// test
	if (s.frameCount === 1) testDraw();
}

const sketch = s => {
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');

