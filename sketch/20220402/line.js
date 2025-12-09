export const setLineParams = (params) => {
	const line = {};
	line.pgWidth = params.size;
	line.pgHeight = params.size/2;
	line.widthRate = 0.1;
	line.num = Math.floor(line.pgWidth * line.widthRate);
	line.alpha = 150;
	const halfSize = Math.ceil(line.pgHeight/2);
	line.layerSize = new Map([['full', line.pgHeight], ['half', halfSize]]);
	line.layerSide = ['above', 'below'];
	params.line = line;
}

export const setLinePgs = (params, pgs, s) => {
	const pgSet = new Map();
	for (const [key, size] of params.line.layerSize) {
		pgSet.set(key, s.createGraphics(params.line.pgWidth, size));
	}
	pgs.lines = new Map();
	for (const side of params.line.layerSide) {
		pgs.lines.set(side, pgSet);
	}
}

const setLine = (lineIndex) => (params, s, pgSize, pgSide, widths) => {
	const line = {};
	line.width = widths[lineIndex];
	const calcHeight = () => {
		if (pgSize === 'full') return params.line.pgHeight;
		if (pgSize === 'half') return params.line.pgHeight/2;
		throw `${pgSize}`
	}
	line.height = calcHeight();
	const calcXPos = () => {
		const accWidths = widths.slice(0, lineIndex);
		return accWidths.reduce((pre, cur) => pre + cur, 0);
	}
	line.pos = s.createVector(calcXPos(), 0);
	const calcColor = () => {
		if (pgSide === 'above') return s.createVector(255, 0, 0);
		if (pgSide === 'below') return s.createVector(0, 0, 255);
		throw `${side}`;
	}
	line.color = calcColor();
	line.alpha = params.line.alpha / params.line.num * lineIndex;
	return line;
}

const setLines = (params, s, pgSide, pgSize) => {
	const widths = Array.from(Array(params.line.num), () => params.line.pgWidth/params.line.num);
	return {
		data: Array.from(Array(params.line.num), (_, lineIndex) => setLine(lineIndex)(params, s, pgSize, pgSide, widths)),
		pgSide: pgSide,
		pgSize: pgSize,
	};
}

export const setLinesMap = (params, s) => {
	const linesMap = new Map();
	for (const pgSide of params.line.layerSide) {
		const linesSet = new Map();
		for (const [pgSize, value] of params.line.layerSize) {
			linesSet.set(pgSize, setLines(params, s, pgSide, pgSize));
		}
		linesMap.set(pgSide, linesSet);
	}
	return linesMap;
}

const updateLine = (preLine, lineIndex) => (s, params, pgSide, pgSize) => {
	const newLine = { ...preLine };
	const calcAlpha = () => {
		const rate = (pgSize === 'full')? 10: 20;
		const rate2 = (pgSide === 'above')? rate: rate*2;
		const initAlpha = params.line.alpha / params.line.num * lineIndex;
		return initAlpha * (Math.sin(s.frameCount / rate2) + 1)/2;
	}
	newLine.alpha = calcAlpha();
	return newLine;
}

const updateLines = (preLines, s, params, pgSide, pgSize) => {
	const newLines = { ...preLines };
	newLines.data = preLines.data.map((preLine, lineIndex) => updateLine(preLine, lineIndex)(s, params, pgSide, pgSize));
	return newLines;
}

export const updateLinesMap = (preLinesMap, s, params) => {
	const newLinesMap = new Map();
	for (const [pgSide, linesSet] of preLinesMap) {
		const newLinesSet = new Map();
		for (const [pgSize, lines] of linesSet) {
			const updatedLines = updateLines(lines, s, params, pgSide, pgSize);
			newLinesSet.set(pgSize, updatedLines);
		}
		newLinesMap.set(pgSide, newLinesSet);
	}
	return newLinesMap;
}

const drawLines = (pg, linesData, s) => {
	pg.background(255, 150);
	for (const line of linesData) {
		pg.push();
		pg.noStroke();
		const color = s.color(line.color.x, line.color.y, line.color.z, line.alpha);
		pg.fill(color);
		pg.rect(line.pos.x, line.pos.y, line.width, line.height);
		pg.pop();
	}
	return false;
}

const deleteLines = (pg, linesData) => {
	pg.background(255);
	for (const line of linesData) {
		pg.push();
		pg.erase(line.alpha*3, line.alpha*3);
		pg.rect(line.pos.x, line.pos.y, line.width, line.height);
		pg.noErase();
		pg.pop();
	}
	return false;
}

export const drawLinePgs = (params, pgs, linesMap, s) => {
	for (const [pgSide, linesSet] of linesMap) {
		const pgSet = pgs.get(pgSide);
		for (const [pgSize, lines] of linesSet) {
			const pg = pgSet.get(pgSize);
			if (pgSize === 'full') drawLines(pg, lines.data, s);
			if (pgSize === 'half') deleteLines(pg, lines.data);
		}
		const calcYPos = () => {
			if (pgSide === 'above') return 0;
			if (pgSide === 'below') return params.size / 2;
			throw `${lines.pgSide}`;
		}
		const yPos = calcYPos();
		const fullPg = pgSet.get('full');
		const halfPg = pgSet.get('half');
		// halfPg.blend(fullPg, 0, 0, params.line.pgWidth, params.line.pgHeight, 0, 0, params.line.pgWidth, params.line.pgHeight/2, s.EXCLUSION);
		s.image(fullPg, 0, yPos);
		s.image(halfPg, 0, yPos);
	}
	return false;
}
