const setParams = (params, tab) => {
	params.line = {
		interval: 2.16,
		gapRate: 7.36,
		weight: 0.5,
		alpha: 200,
	}
	const _param = params.line;
	const _tab = tab.pages[1];
	_tab.addInput(_param, 'interval', { min: 0, max: 5 });
	_tab.addInput(_param, 'gapRate', { min: 0, max: 20 });
	_tab.addInput(_param, 'weight', { min: 0, max: 2 });
	_tab.addInput(_param, 'alpha', { min: 100, max: 255 });
	return false;
}

const calc = (preObj, params, s) => {
	const newObj = { ...preObj };
	const isInit = (s.frameCount === 0);
	const { interval, gapRate } = params.line;
	if (isInit) {
		
		// preLineObj.lines = Array.from(Array(newLineObj.num), () => 1);
	}
	newObj.num = Math.floor(params.size / interval);
	newObj.lines = Array.from(Array(newObj.num), (_, lineIndex) => {
		const newLine = {};
		newLine.startPos = (() => {
			const x = interval * lineIndex - gapRate;
			const y = 0;
			return s.createVector(x, y);
		})();
		newLine.endPos = (() => {
			const x = interval * lineIndex + gapRate;
			const y = params.size;
			return s.createVector(x, y);
		})();
		return newLine;
	});
	return newObj;
}

const draw = (obj, params, s) => {
	s.push();
	s.blendMode(s.MULTIPLY);
	const { interval, weight, alpha } = params.line;
	for (const line of obj.lines) {
		const { startPos, endPos } = line;
		s.strokeWeight(interval * weight);
		s.stroke(111, 208, 140, alpha);
		s.line(startPos.x, startPos.y, startPos.x, endPos.y);
		s.stroke(123, 158, 168, alpha);
		s.line(startPos.x, startPos.y, endPos.x, endPos.y);
		s.stroke(205, 223, 160, alpha);
		s.curve(
			startPos.x, endPos.y * 0.5,
			startPos.x, startPos.y,
			endPos.x, endPos.y,
			endPos.x, endPos.y * 0.5
		);
	}
	s.pop();
}

export const line = { setParams, calc, draw }
