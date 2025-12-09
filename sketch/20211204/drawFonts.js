import { s } from './sketch.js';

export const drawFonts = (fonts, phrase, params) => {
	s.fill(0);
	s.stroke(0);
	fonts.forEach((font, index) => {
		const points = font.points;
		if (points[0] != null && points[0] != undefined) {
			s.push();
			s.beginShape();
			s.translate(phrase.accWidths[index], params.size / 2);
			const start = points[0];
			s.curveVertex(start.x, start.y);
			points.forEach(point => s.curveVertex(point.x, point.y));
			const end = points[points.length - 1];
			s.curveVertex(end.x, end.y);
			s.endShape(s.CLOSE);
			s.pop();
		}
	});
}