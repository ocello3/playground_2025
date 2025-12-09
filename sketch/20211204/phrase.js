import { s } from './sketch.js';

export const setPhrase = (fonts, params) => {
	// calc font total width
	const phrase = {};
	const fontWidths = fonts.map(font => font.bounds.w);
	const firstFontWidth = 0;
	fontWidths.unshift(firstFontWidth);
	phrase.accWidths = fontWidths.map((width, index) => {
		const prevWidths = fontWidths.slice(0, index + 1); // +1？
		return prevWidths.reduce((pre, acc) => pre + acc);
	});
	return phrase;
}

const outPhraseAccWidths = (phrase) => {
	const txtLog = s.createWriter('phraseAccWidths.csv');
	txtLog.print('id, accWidth');
	phrase.accWidths.forEach((accWidth, index) => {
		txtLog.print(`${index}, ${accWidth}`);
	});
	txtLog.close();
	txtLog.clear();
}

export const testSetPhrase = (phrase, params) => {
	phrase.accWidths.forEach((accWidth, index) => {
		const isAboveZero = accWidth >= 0;
		const isBelowBound = accWidth <= params.size;
		console.assert(isAboveZero, `index: ${index}`);
		console.assert(isBelowBound, `index: ${index}`);
	});
	// outPhraseAccWidths(phrase);
}