import { setParams, testSetParams, updateParams, setGui_params } from './params.js';
import { gui } from './gui.js';
import { setScroll, updateScroll } from './scroll.js';
// import { setSynth } from './synth.js';

let params;
let scroll;
// let synth;

const testSetup = () => {
	testSetParams(params);
}

const thisSetup = s => {
	params = setParams();
	const tab = gui(params);
	// synth = setSynth(params, tab);
	setGui_params(params, tab);
	s.createCanvas(params.size, params.size);
	scroll = setScroll();
	// test
	testSetup();
}

const testDraw = () => {
	
	s.noLoop(); // do not delete
}

const thisDraw = s => {
	s.background(255);
	// update
	updateParams(params);
	scroll = updateScroll(scroll, params);
	// draw frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size, params.size);
	s.pop();
	// draw text
	s.textSize(params.size / 25);
	s.textAlign(s.CENTER, s.CENTER);
	// s.text('<< -- scroll down -- >>', s.width / 2, s.height / 2);
	s.text(`x: ${scroll.velocity.x}, y: ${scroll.velocity.y}`, s.width / 2, s.height / 2);
	// draw line
	s.fill(0);
	s.circle(scroll.velocity.x, scroll.velocity.y, 10);
	// test
	if (s.frameCount === 1) testDraw();
}

const sketch = s => {
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
/**
* @type {p5} p5
*/
export const s = new p5(sketch, 'sketch');
