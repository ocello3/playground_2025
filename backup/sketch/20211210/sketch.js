import { setParams, testSetParams, updateParams, setGui_params } from './params.js';
import { gui } from './gui.js';
import { setSynth } from './synth.js';

let params;
let synth;
let tempNum = 0;

const testSetup = () => {
	testSetParams(params);
}

const thisSetup = s => {
	params = setParams();
	const tab = gui(params);
	synth = setSynth(params, tab);
	setGui_params(params, tab);
	s.createCanvas(params.size, params.size);
	// test
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	s.background(255);
	// update
	updateParams(params);
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

