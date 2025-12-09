const init = (params, s, tab) => {
	params.mover = {
		num: 500,
		step: 1,
		accMin: 0,
		accMax: 10,
	}
	const _param = params.mover;
	const _tab = tab.pages[1];
	// _tab.addInput(_param, 'step', { step: 1, min: 1, max: 50 }); //
	const moverObj = {};
	const { num, accMax } = _param;
	moverObj.movers = Array.from(Array(num), () => {
		const mover = {};
		mover.accMax = Math.random() * accMax;
		mover.currentPos = s.createVector(Math.random() * params.size, Math.random() * params.size);
		return mover;
	});
	return moverObj;
}

const update = (preObj, params, s) => {
	const { accMin } = params.mover;
	const newObj = { ...preObj };
	newObj.targetPos = s.createVector(s.mouseX, s.mouseY);
	const { targetPos } = newObj;
	newObj.movers = preObj.movers.map((preMover) => {
		const newMover = { ...preMover };
		const { accMax } = preMover;
		newMover.currentPos = (() => {
			const diff = p5.Vector.sub(targetPos, preMover.currentPos);
			const diffNorm = p5.Vector.normalize(diff);
			const dist = p5.Vector.mag(diff);
			const acc = s.map(params.size - dist, 0, params.size, accMin, accMax);
			const constrainedAcc = s.constrain(acc, accMin, accMax);
			const progress = p5.Vector.mult(diffNorm, constrainedAcc);
			return p5.Vector.add(preMover.currentPos, progress);
		})();
		// if (s.frameCount%200 === 0) newMover.currentPos = s.createVector(Math.random() * params.size, Math.random() * params.size);
		return newMover;
	});
	return newObj;
}

const draw = (obj, params, s) => {
	s.push();
	for (const mover of obj.movers) {
		const { currentPos } = mover;
		s.point(currentPos.x, currentPos.y);
	}
	s.pop();
}

export const mover = { init, update, draw }
