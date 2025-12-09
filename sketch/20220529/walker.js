const setParams = (params, tab) => {
	params.walker = {
		num: 20,
		step: 50,
		isProgressProb: 0.02,
		easingF: 0.2,
	}
	const _param = params.walker;
	const _tab = tab.pages[1];
	_tab.addInput(_param, 'step', { step: 1, min: 1, max: 50 });
	_tab.addInput(_param, 'isProgressProb', { step: 0.01, min: 0.01, max: 0.1 });
	_tab.addInput(_param, 'easingF', { step: 0.01, min: 0.01, max: 0.5 });
	return false;
}

const calc = (preObj, params, s) => {
	const { num, step, isProgressProb, easingF } = params.walker;
	const isInit = (s.frameCount === 1);
	if (isInit) {
		preObj = {};
		preObj.walkers = Array.from(Array(num), () => false);
	}
	const newObj = { ...preObj };
	newObj.walkers = preObj.walkers.map((preWalker, walkerIndex) => {
		if (isInit) {
			preWalker = {};
			preWalker.targetPos = s.createVector(params.size * 0.5, params.size * 0.5);
			preWalker.pos = preWalker.targetPos;
		}
		const newWalker = { ...preWalker };
		const { targetPos, pos } = preWalker;
		newWalker.dist = {
			above: targetPos.y,
			below: params.size - targetPos.y,
			left: targetPos.x,
			right: params.size - targetPos.x
		}
		newWalker.rate = (() => {
			const calcRate = (dist, before = 0) => {
				const thisDist = s.map(dist, 0, params.size, 0, 0.5);
				return thisDist + before;
			}
			const above = calcRate(newWalker.dist.above);
			const below = calcRate(newWalker.dist.below, above);
			const left = calcRate(newWalker.dist.left, below);
			const right = calcRate(newWalker.dist.right, left);
			return { above, below, left, right };
		})();
		newWalker.prob = Math.random();
		newWalker.direction = (() => {
			if (newWalker.prob < newWalker.rate.above) return 'above';
			if (newWalker.prob < newWalker.rate.below) return 'below';
			if (newWalker.prob < newWalker.rate.left) return 'left';
			return 'right';
		})();
		newWalker.progress = (() => {
			if (newWalker.direction === 'above') return s.createVector(0, -1 * step);
			if (newWalker.direction === 'below') return s.createVector(0, step);
			if (newWalker.direction === 'left') return s.createVector(-1 * step, 0);
			if (newWalker.direction === 'right') return s.createVector(step, 0);
			throw newWalker.direction;
		})();
		newWalker.prob2 = Math.random();
		newWalker.isProgress = (newWalker.prob2 < isProgressProb);
		newWalker.targetPos = newWalker.isProgress ? p5.Vector.add(targetPos, newWalker.progress) : targetPos;
		newWalker.preTargetPos = targetPos;
		newWalker.pos = (() => {
			const diff = p5.Vector.sub(newWalker.targetPos, pos);
			const progress = p5.Vector.mult(diff, easingF);
			return p5.Vector.add(pos, progress);
		})();
		return newWalker;
	});
	return newObj;
}

const draw = (obj, params, s) => {
	s.push();
	s.strokeWeight(2);
	s.stroke(0, 100);
	s.noFill();
	s.beginShape();
	for (const walker of obj.walkers) {
		const { isProgress, pos, preTargetPos, targetPos } = walker;
		if (isProgress) s.vertex(pos.x, pos.y);
	}
	s.endShape();
	for (const walker of obj.walkers) {
		const { isProgress, pos, preTargetPos, targetPos } = walker;
		s.noFill();
		s.point(pos.x, pos.y);
		s.line(preTargetPos.x, preTargetPos.y, targetPos.x, targetPos.y);
	}
	s.pop();
}

export const walker = { setParams, calc, draw }
