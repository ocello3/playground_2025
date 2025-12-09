const init = (params, s, tab) => {
	params.wind = {
		num: params.mover.num,
		lengthMin: 10,
		lengthMax: 30,
		gravityRate: 2,
		windRate: 10,
		bufferAdjustRate: 5,
		bufferBaseRate: 0.1,
	}
	const _param = params.wind;
	const _tab = tab.pages[1];
	// _tab.addInput(_param, 'windF', { min: 0, max: 10 }); //
	const windObj = {};
	const { num, lengthMin, lengthMax } = _param;
	windObj.winds = Array.from(Array(num), () => {
		const wind = {};
		wind.length = s.map(Math.random(), 0, 1, lengthMin, lengthMax);
		wind.startPos = (() => {
			const x = Math.random() * params.size;
			const y = Math.random() * params.size;
			return s.createVector(x, y);
		})();
		wind.endPos = wind.startPos;
		return wind;
	});
	return windObj;
}

const update = (preObj, moverObj, params, s) => {
	const newObj = { ...preObj };
	newObj.winds = preObj.winds.map((preWind, index) => {
		const newWind = { ...preWind };
		const mover = moverObj.movers[index];
		const { lengthMin, lengthMax, gravityRate, windRate, bufferAdjustRate, bufferBaseRate } = params.wind;
		const { bufferRate, bufferRateMin } = params.mover;
		newWind.vec = (() => {
			const buffer = (bufferRate - bufferRateMin + bufferBaseRate) * bufferAdjustRate;
			const originalVec = p5.Vector.mult(mover.acc, bufferRate * buffer);
			const adjustRate = s.createVector(windRate, gravityRate);
			return p5.Vector.mult(originalVec, adjustRate);
		})();
		newWind.length = (() => {
			if (preWind.isReset) return s.map(Math.random(), 0, 1, lengthMin, lengthMax);
			return preWind.length - p5.Vector.mag(newWind.vec);
		})();
		newWind.isReset = (() => {
			if (preWind.isReset) return false;
			return (newWind.length < 0);
		})();
		newWind.startPos = (() => {
			if (newWind.isReset) {
				const x = Math.random() * params.size;
				const y = Math.random() * params.size;
				return s.createVector(x, y);
			}
			return preWind.startPos;
		})();
		newWind.endPos = (() => {
			if (newWind.isReset) return newWind.startPos;
			return p5.Vector.add(preWind.endPos, newWind.vec);
		})();
		return newWind;
	});
	return newObj;
}

const draw = (obj, params, s) => {
	s.push();
	s.strokeWeight(3);
	s.stroke(0, 60);
	for (const wind of obj.winds) {
		const { startPos, endPos } = wind;
		s.line(startPos.x, startPos.y, endPos.x, endPos.y);
	}
	s.pop();
}

export const wind = { init, update, draw };
