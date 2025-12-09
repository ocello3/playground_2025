const init = (params, s, tab=null) => {
	if (tab != null) {
		params.attractor = {
			status: 'update',
			num: 7,
			mMinRate: 0.005,
			mMaxRate: 0.01,
			originMRate: 0.015,
			g: 0.4,
			sizeRate: 5,
		}
		params.color = [
			s.color(188, 150, 230),
			s.color(216, 180, 226),
			s.color(174, 117, 159)
		];
		const _tab = tab.pages[1];
		const _param = params.attractor;
		_tab.addInput(_param, 'originMRate', { step: 0.01, min: 0.01, max: 0.1 });
		_tab.addInput(_param, 'num', { step: 1, min: 2, max: 15 });
		_tab.addMonitor(_param, 'status');
		const resetBtn = _tab.addButton({
			title: 'orbit',
			label: 'reset',
		});
		resetBtn.on('click', () => {
			_param.status = 'reset';
		});
	}
	const attractorObj = {};
	const { num, mMinRate, mMaxRate, originMRate, } = params.attractor;
	attractorObj.attractors = Array.from(Array(num), (_, index) => {
		const attractor = {};
		attractor.v = s.createVector(0, 0);
		attractor.pos = (() => {
			if (index === 0) return s.createVector(params.size * 0.5, params.size * 0.5);
			const x = Math.random() * params.size;
			const y = Math.random() * params.size;
			return s.createVector(x, y);
		})();
		attractor.m = (() => {
			if (index === 0) return params.size * originMRate;
			const min = params.size * mMinRate;
			const max = params.size * mMaxRate;
			return s.map(Math.random(), 0, 1, min, max);
		})();
		attractor.color = (() => {
			const cIndex = index % params.color.length;
			return params.color[cIndex];
		})();
		return attractor;
	});
	return attractorObj;
}

const update = (preObj, params, s, tab) => {
	const { g, originMRate, status} = params.attractor;
	if (status === 'reset') {
		params.attractor.status = 'update';
		return init(params, s);
	}
	const newObj = { ...preObj };
	newObj.attractors = preObj.attractors.map((preAttractor, thisIndex, preAttractors) => {
		const newAttractor = { ...preAttractor };
		if (thisIndex === 0) newAttractor.m = originMRate * params.size;
		newAttractor.f = preAttractors.reduce((preF, curAttractor, otherIndex) => {
			if (otherIndex === thisIndex) return p5.Vector.add(preF, s.createVector(0, 0));
			const curVec = p5.Vector.sub(curAttractor.pos, newAttractor.pos);
			const curUnitVec = p5.Vector.normalize(curVec);
			const curVecMag = p5.Vector.mag(curVec);
			const curFco = g * newAttractor.m * curAttractor.m / curVecMag;
			const curF = p5.Vector.mult(curUnitVec, curFco);
			return p5.Vector.add(curF, preF);
		}, s.createVector(0, 0));
		newAttractor.a = p5.Vector.div(newAttractor.f, newAttractor.m);
		newAttractor.v = p5.Vector.add(preAttractor.v, newAttractor.a);
		newAttractor.pos = (() => {
			if (thisIndex === 0) return preAttractor.pos;
			return p5.Vector.add(preAttractor.pos, newAttractor.v);
		})();
		return newAttractor;
	});
	return newObj;
};

const draw = (obj, params, s) => {
	const { attractors } = obj;
	const { sizeRate } = params.attractor;
	s.push();
	s.noStroke();
	for (const attractor of attractors) {
		s.push();
		const { pos, m, color } = attractor;
		s.fill(color);
		s.circle(pos.x, pos.y, m * sizeRate);
		s.pop();
	}
	s.pop();
}

export const attractor = { init, update, draw };