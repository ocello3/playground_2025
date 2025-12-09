const set = (params, s, tab) => {
	params.arrow = {
		piece: 20,
		arrowLengthRate: 0.7,
		tipAngleRate: 0.2,
		tipLengthRate: 0.8,
		easingFmin: 0.001,
		easingFmax: 0.04,
	}
	const p = params.arrow;
    const t = tab.pages[1];
	// t.addInput(p, 'angle', { min: 0, max: Math.PI * 2});
}

const init = (params, s) => {
	const { piece, arrowLengthRate, tipAngleRate, tipLengthRate, easingFmin, easingFmax } = params.arrow;
	const num = Math.pow(piece, 2);
	const interval = Math.floor(params.size / piece);
	const arrows = Array.from(Array(num), (_, arrowIndex) => {
		const indexVec = (() => {
			const x = arrowIndex % piece;
			const y = Math.floor(arrowIndex / piece);
			return s.createVector(x, y);
		})();
		const pos = (() => {
			const x = indexVec.x * interval;
			const y = indexVec.y * interval;
			return s.createVector(x, y);
		})();
		const offsetVec = (() => {
			const offset = interval * 0.5;
			return s.createVector(offset, offset);
		})();
		const arrowLength = interval * 0.5 * arrowLengthRate;
		const easingF = s.map(Math.random(), 0, 1, easingFmin, easingFmax);
		const angle = 0;
		const tipAngle = Math.PI * tipAngleRate;
		const tipLength = arrowLength * tipLengthRate;
		return {
			indexVec,
			pos,
			offsetVec,
			arrowLength,
			easingF,
			angle,
			tipAngle,
			tipLength,
		};
	});
	return {
		num,
		interval,
		arrows,
	};
}

const update = (preObj, params, s) => {
	const arrows = preObj.arrows.map((preArrow, index) => {
		const targetAngle = (() => {
			const mousePos = s.createVector(s.mouseX, s.mouseY);
			const translatedPos = p5.Vector.sub(preArrow.pos, mousePos);
			return Math.atan2(translatedPos.x, translatedPos.y);
		})();
		const progress = (() => {
			const diff = targetAngle - preArrow.angle;
			return diff * preArrow.easingF;
		})();
		const angle = preArrow.angle + progress;
		return {
			...preArrow,
			targetAngle,
			progress,
			angle,
		};
	});
	return {
		...preObj,
		arrows,
	}
}

const draw = (obj, params, s) => {
	const { arrows } = obj;
	for (const arrow of arrows) {
		const { pos, offsetVec, progress, angle, arrowLength, tipAngle, tipLength } = arrow;
		const tipPos = s.createVector(arrowLength, 0);
		const tipHeight = tipLength * Math.sin(tipAngle);
		const tipWidth = tipLength * Math.cos(tipAngle);
		s.push();
		s.strokeWeight(2);
		s.stroke(0, s.map(progress, 0, Math.PI * 0.02, 0, 255));
		s.translate(p5.Vector.add(pos, offsetVec));
		s.rotate(angle);
		// main body
		s.line(-tipPos.x, tipPos.y, tipPos.x, tipPos.y);
		// tip
		s.line(tipPos.x, tipPos.y, tipPos.x - tipWidth, tipPos.y - tipHeight);
		s.line(tipPos.x, tipPos.y, tipPos.x - tipWidth, tipPos.y + tipHeight);
		s.pop();
	}
	// pointer
	s.fill(0);
	s.circle(s.mouseX, s.mouseY, params.size * 0.03);
}

export const arrow = { set, init, update, draw };