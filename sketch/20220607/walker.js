const init = (params, s, tab) => {
	params.walker = {
		num: 100,
		step: 1,
	}
	const _param = params.walker;
	const _tab = tab.pages[1];
	// _tab.addInput(_param, 'step', { step: 1, min: 1, max: 50 }); //
	const walkerObj = {};
	const { num } = _param;
	walkerObj.walkers = Array.from(Array(num), () => {
		const walker = {};
		walker.probPos = s.createVector(0, params.size * 0.5);
		walker.pos = s.createVector(params.size * 0.5, params.size);
		return walker;
	});
	return walkerObj;
}

const update = (preObj, params, s) => {
	const { step } = params.walker;
	const newObj = { ...preObj };
	newObj.walkers = preObj.walkers.map((preWalker) => {
		const newWalker = { ...preWalker };
		newWalker.prob = (() => {
			while (true) {
				const r1 = Math.random();
				const p = Math.pow(r1, 0.6);
				const r2 = Math.random();
				if (r2 < p) {
					return r1;
				} else {
					return true;
				}
			}
		})();
		newWalker.probPos = (() => {
			const x = preWalker.probPos.x + 1;
			const y = newWalker.prob * params.size;
			return s.createVector(x, y);
		})();
		newWalker.diff = (() => {
			const p = newWalker.prob;
			if (p < 0.25) return s.createVector(0, step);
			if (p < 0.5) return s.createVector(step * 3, 0);
			if (p < 0.75) return s.createVector(step * (-3), 0);
			return s.createVector(0, step * (-1));
		})();
		newWalker.pos = p5.Vector.add(preWalker.pos, newWalker.diff);
		return newWalker;
	});
	return newObj;
}

const draw = (obj, params, s) => {
	s.push();
	for (const walker of obj.walkers) {
		// draw random walker
		const { pos, probPos, prob } = walker;
		s.stroke(prob * 255, pos.y / params.size * 255, 255);
		s.fill(prob * 255);
		s.circle(pos.x, pos.y, 1);
		s.point(probPos.x, probPos.y);
		// draw prob line
	}
	s.pop();
}

export const walker = { init, update, draw }
