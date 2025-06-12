import { setParams, updateParams, gui } from './params.js';
import { setDot, updateDot } from './dot.js';
import { setPoly, updatePoly, testSetPoly, testUpdatedPoly } from './poly.js';

let params;
let grid;
let poly;
let img;

const thisPreload = s => {
	img = s.loadImage('../../image/IMG_0020.jpeg');
	if (img.width > img.height) img.resize(img.width, 0);
	if (img.width <= img.height) img.resize(0, img.height);
}

const testSetup = () => {
	testSetPoly(poly);
}

const thisSetup = s => {
	s.noiseSeed(90);
	params = setParams();
	s.createCanvas(params.size, params.size);
	const totalNum = params.num * params.num;
	grid = Array.from(Array(totalNum), (dot, index) => setDot(index)(params, img));
	poly = setPoly(params, grid);
	gui(params);
	testSetup();
}

const testDraw = () => {
	s.noLoop();
	// testUpdatedPoly(params, grid);
}

const thisDraw = s => {
	// update
	updateParams(params);
	grid = grid.map((dot) => updateDot(dot)(params));
	poly = updatePoly(poly)(grid, params);
	// frame
	s.background(255);
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size);
	s.pop();
	// draw poly
	for (let i = 0; i < poly.poss.length; i++) {
		const pos = poly.poss[i];
		s.noStroke();
		s.fill(grid[pos.z].color);
		s.circle(pos.x, pos.y, Math.pow(params.circleSize_base, poly.dists[pos.z])*params.circleSize_mult);
	}
	// testDraw();
}

const sketch = s => {
	s.preload = () => thisPreload(s);
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
