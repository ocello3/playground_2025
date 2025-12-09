import { s } from './sketch.js';

const setFont = (index) => (params) => {
	const font = {};
	font.char = params.text.substr(index, 1);
	font.points = params.font.textToPoints(font.char, 0, 0, params.fontSize, { // x, y - coordinate
		sampleFactor: params.sampleFactor, // higher values yield more points
		simplifyThreshold: params.simplifyThreshold, // if set to a non-zero value, collinear points will be be removed from the polygon
	});
	font.bounds = params.font.textBounds(font.char, 0, 0, params.fontSize);
	return font;
}

export const setFonts = (params) => Array.from(Array(params.text.length), (font, index) => setFont(index)(params));

const outTextPoints = (fonts) => {
	const pointsArray = fonts.map(font => font.points);
	const txtLog = s.createWriter('points.csv');
	txtLog.print('char, id, x, y');
	pointsArray.forEach((points, fontIndex) => {
		points.forEach((point, index) => {
			txtLog.print(`${fontIndex}, ${index}, ${point.x}, ${point.y}`);
		});
	});
	txtLog.close();
	txtLog.clear();
}

const outFontBounds = (fonts) => {
	const txtLog = s.createWriter('bounds.csv');
	txtLog.print('id, x, y, w, h');
	fonts.forEach((font, index) => {
		txtLog.print(`${index}, ${font.bounds.x}, ${font.bounds.y}, ${font.bounds.w}, ${font.bounds.h}`);
	});
	txtLog.close();
	txtLog.clear();
}

const testSetFont = (font, index) => {
	const isFontChar = font.char != null || undefined;
	console.assert(isFontChar, font.char);
}

export const testSetFonts = (fonts) => {
	// 配列が空でないことを確認する
	fonts.forEach((font, index) => testSetFont(font, index));
	// outTextPoints(fonts); // remove comment if output
	// outFontBounds(fonts);
}

const updatePoints = (prePoints, params) => {
	// return prePoints.filter((point, index) => index%params.outlineStep === 0);
	const newPoints = [];
	prePoints.forEach((point, index) => {
		if (index % params.outlineStep === 0) newPoints.push(point);
	});
	return newPoints;
}

const updateFont = (preFont) => (params) => {
	const newFont = { ...preFont };
	newFont.points = updatePoints(preFont.points, params);
	return newFont;
}

export const updateFonts = (preFonts, params) => {
	const newFonts = preFonts.map(preFont => updateFont(preFont)(params));
	return newFonts;
}

const testUpdateFont = (font, index) => {
	
}

export const testUpdateFonts = (fonts) => {
	// 配列が空でないことを確認する
	fonts.forEach((font, index) => testUpdateFont(font, index));
}