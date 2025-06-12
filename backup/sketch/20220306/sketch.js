import { setParams, updateParams, gui } from '../../util/params.js';
import { drawFrame } from '../../util/drawFrame.js';
import { debug } from '../../util/debug.js'; // obj, length=null, start=0
import { setParamsForBall, setBalls, updateBalls, drawBall } from './ball.js';
// import { setSynth, playSynth } from './synth.js';

let params; // size
let balls;
// let synth;

const thisSetup = s => {
	params = setParams();
	s.createCanvas(params.size, params.size);
	setParamsForBall(params);
	// tab.pages[0].addInput(params, 'margin');
	const tab = gui(s, params, false, false); // audio, seq
	balls = setBalls(s, params);
	// synth = setSynth();
	s.noLoop();
	// s.frameRate(2);
}

const thisDraw = s => {
	s.background(255);
	// playSynth(ball, synth);
	drawBall(s, balls.ballArr);
	// debug(balls, 1);
	drawFrame(s, params);
	updateParams(s, params);
	balls = updateBalls(balls, s, params);
}

const sketch = s => {
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
