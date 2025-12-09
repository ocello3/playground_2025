import { test, setParams, updateParams, setDot, updateDot } from './calc.js';
import { gui } from './gui.js';

let params;
let grid;
let img;

const thisPreload = s => {
	img = s.loadImage('../../image/IMG_0020.jpeg');
	if (img.width > img.height) img.resize(img.width, 0);
	if (img.width <= img.height) img.resize(0, img.height);
}

const thisSetup = s => {
	s.noiseSeed(99);
	params = setParams();
	s.createCanvas(params.size, params.size);
	const totalNum = params.num * params.num;
	grid = Array.from(Array(totalNum), (dot, index) => setDot(index)(params, img));
	gui(params);
	test();
}

const thisDraw = s => {
	// update
	updateParams(params);
	grid = grid.map((dot) => updateDot(dot)(params));
	// s.noLoop();
	s.background(255);
	// frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size);
	s.pop();
	// image
	// s.image(img, 0, 0);
	// text
	s.push();
	s.textSize(10);
	s.textAlign(s.CENTER);
	// s.fill(0);
	grid.forEach((dot, index) => {
		s.noStroke();
		s.fill(dot.color);
		const size = dot.size * dot.noise * 2.5;
		s.rect(dot.pos.x, dot.pos.y, size, size, 3);
	});
	s.pop();
}

const sketch = s => {
	s.preload = () => thisPreload(s);
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
