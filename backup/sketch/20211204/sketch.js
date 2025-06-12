import { setParams, testSetParams, updateParams, gui } from './params.js';
import { setFonts, testSetFonts, updateFonts, testUpdateFonts } from './font.js';
import { setPhrase, testSetPhrase } from './phrase.js';
import { drawFonts } from './drawFonts.js';

let params;
let fonts;
let phrase;

const thisPreload = s => {
	params = {
		font: s.loadFont('../../font/HelveticaNeue-Regular.otf'),　
	}
}

const testSetup = () => {
	testSetParams(params);
	testSetFonts(fonts);
	testSetPhrase(phrase, params);
}

const thisSetup = s => {
	setParams(params);
	fonts = setFonts(params);
	phrase = setPhrase(fonts, params);
	gui(params);
	s.createCanvas(params.size, params.size);
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	s.background(255);
	/* frame */
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size, params.size);
	s.pop();
	// update
	updateParams(params);
	const updatedFonts = updateFonts(fonts, params);
	// draw font points
	drawFonts(updatedFonts, phrase, params);
	if (s.frameCount === 1) testDraw();
}

const sketch = s => {
	s.preload = () => thisPreload(s);
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
