const init = (params, s, tab) => {
	params.flooder = {
		surfaceYPosRate: 0.4,
		g: 0.3,
		mMin: 25,
		mMax: 100,
		initPosMaxRate: 1.2,
		text: "Create pockets",
		cd: 2,
		rotateSpeedRate: 0.01,
		angleRangeRate: 0.007,
		fontAvatorNum: 2,
		fontAvatorAngleGap: 0.4,
	}
	const _param = params.flooder;
	const _tab = tab.pages[1];
	_tab.addInput(_param, 'surfaceYPosRate', { step: 0.1, min: 0.2, max: 0.8 });
	_tab.addInput(_param, 'g', { step: 0.1, min: 0.2, max: 1.2 });
	_tab.addInput(_param, 'mMin', { step: 1, min: 5, max: 20 });
	_tab.addInput(_param, 'mMax', { step: 1, min: 50, max: 150 });
	_tab.addInput(_param, 'initPosMaxRate', { step: 0.1, min: 0.1, max: 1.5 });
	_tab.addInput(_param, 'cd', { step: 0.1, min: 0.5, max: 4.0 });
	const flooderObj = {};
	const { surfaceYPosRate, text, fontAvatorNum, fontAvatorAngleGap } = _param;
	flooderObj.num = _param.text.length;
	flooderObj.surfaceYPos = params.size * surfaceYPosRate;
	flooderObj.isReset = true;
	flooderObj.flooders = Array.from(Array(flooderObj.num), (_, index) => {
		const flooder = {};
		flooder.font = text[index];
		flooder.isOver = true;
		flooder.angles = Array.from(Array(fontAvatorNum), (_, index) => index * fontAvatorAngleGap * Math.PI);
		return flooder;
	});
	return flooderObj;
}

const update = (preObj, params, s) => {
	const newObj = { ...preObj };
	const { mMin, mMax, g, initPosMaxRate, cd, angleRangeRate, rotateSpeedRate, fontAvatorAngleGap } = params.flooder;
	const { isReset, surfaceYPos } = preObj;
	newObj.mArray = (() => {
		if (isReset) {
			return Array.from(Array(preObj.num), () => {
				return s.map(Math.random(), 0, 1, mMin, mMax);
			});
		}
		return preObj.mArray;
	})();
	newObj.textWidthArray = (() => {
		if (isReset) {
			return newObj.mArray.map((m, index) => {
				s.textSize(m);
				return s.textWidth(preObj.flooders[index].font);
			});
		}
		return preObj.textWidthArray;
	})();
	newObj.flooders = preObj.flooders.map((preFlooder, index) => {
		const newFlooder = { ...preFlooder };
		const updatePos = () => p5.Vector.add(preFlooder.pos, newFlooder.v);
		newFlooder.m = newObj.mArray[index];
		newFlooder.a = (() => {
			if (preFlooder.isInWater) {
				const vScalar = p5.Vector.mag(preFlooder.v);
				const vUnit = p5.Vector.normalize(preFlooder.v);
				const f = Math.pow(vScalar, 2) * cd * vUnit.y * (-1);
				const a = f / newFlooder.m;
				return s.createVector(0, a);
			}
			return 0;
		})();
		newFlooder.v = (() => {
			if (isReset) return s.createVector(0, 0);
			const a = p5.Vector.add(s.createVector(0, g), newFlooder.a);
			return p5.Vector.add(preFlooder.v, a);
		})();
		newFlooder.pos = (() => {
			if (isReset) {
				const splitedTextWidthArray = newObj.textWidthArray.slice(0, index);
				const x = splitedTextWidthArray.reduce((prev,current)=>prev + current,0);
				const y = (-1) * Math.random() * initPosMaxRate * params.size;
				return s.createVector(x, y);
			}
			return updatePos();
		})();
		newFlooder.angles = preFlooder.angles.map((_, index) => {
			if (preFlooder.isInWater) {
				const angleRange = angleRangeRate * Math.PI * p5.Vector.mag(newFlooder.v);
				const min = angleRange * (-1);
				const max = angleRange;
				const cycle = s.frameCount * rotateSpeedRate * newFlooder.m;
				if (index === 0) return s.map(Math.sin(cycle), 0, 1, min, max);
				if (index === 1) return s.map(Math.sin(cycle * fontAvatorAngleGap), 0, 1, min, max);
			} 
			return 0;
		});
		newFlooder.isInWater = (newFlooder.pos.y > surfaceYPos);
		newFlooder.isOver = (newFlooder.pos.y > params.size * (1 + initPosMaxRate) || newFlooder.pos.y < (-1) * initPosMaxRate * params.size);
		return newFlooder;
	});
	newObj.isReset = (() => {
		for (const flooder of newObj.flooders) {
			if (flooder.isOver === false) return false;
		}
		return true;
	})();
	return newObj;
}

const draw = (obj, params, s) => {
	const { surfaceYPos } = obj;
	// draw water
	s.push();
	s.noStroke();
	s.fill(181, 141, 182, 40);
	s.rect(0, surfaceYPos, params.size, params.size - surfaceYPos);
	s.pop();
	// draw flooders
	s.push();
	s.textAlign(s.CENTER, s.BASELINE);
	s.textFont(params.font);
	for (const flooder of obj.flooders) {
		const { m, font, pos, isInWater, angles } = flooder;
		const a = isInWater? 150: 250;
		s.push();
		s.textSize(m);
		s.translate(pos.x, pos.y);
		angles.forEach((angle, index) => {
			s.push();
			if (index === 0) s.fill(208, 173, 167, a);
			if (index === 1) s.fill(173, 106, 108, a * 0.4);
			s.rotate(angle);
			s.text(font, 0, 0);
			s.pop();
		});
		s.pop();
	}
	s.pop();
}

export const flooder = { init, update, draw };
