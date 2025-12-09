export const setCircleParams = (params, tab) => {
	params.circle = {
		mouseChangeProb: 0.01,
		mouseEasigF: 0.02,
		gridPieceNum: 5,
		minCircleNum: 15,
		maxCircleNum: 40,
		circleRadiusReducRate: 0.5,
		minCenterOffsetRate: 0.15,
		maxCenterOffsetRate: 1.15,
		angleChangeProb: 0.01,
		angleEasingF: 0.02,
		colorAlpha: 70,
	};
	tab.pages[1].addInput(params.circle, 'mouseChangeProb', {min: 0.005, max: 0.1});
	tab.pages[1].addInput(params.circle, 'mouseEasigF', {min: 0.01, max: 0.1});
	tab.pages[1].addInput(params.circle, 'minCircleNum', { step: 1, min: 3, max: 15});
	tab.pages[1].addInput(params.circle, 'maxCircleNum', { step: 1, min: 20, max: 40});
	tab.pages[1].addInput(params.circle, 'circleRadiusReducRate', {min: 0.3, max: 1.3});
	tab.pages[1].addInput(params.circle, 'minCenterOffsetRate', {min: -0.5, max: 0.5});
	tab.pages[1].addInput(params.circle, 'maxCenterOffsetRate', {min: 0.5, max: 1.5});
	tab.pages[1].addInput(params.circle, 'angleChangeProb', {min: 0.005, max: 0.1});
	tab.pages[1].addInput(params.circle, 'angleEasingF', {min: 0.01, max: 0.1});
	tab.pages[1].addInput(params.circle, 'colorAlpha', { step: 1, min: 5, max: 150});
	return false;
}

const calcCircles = (preGrid, newGrid, preCircleObj, newCircleObj, params, s) => {
	const newCircles = Array.from(Array(newCircleObj.circleNum), (_, circleIndex) => {
		const newCircle = {};
		const diff = newGrid.circleOffsetInterval * circleIndex;
		newCircle.radius = newCircleObj.gridSize * params.circle.circleRadiusReducRate - diff;
		const rotatedDiff = p5.Vector.rotate(s.createVector(diff, 0), newGrid.circleAngle);
		newCircle.centerPos = p5.Vector.add(newGrid.centerPos, rotatedDiff);
		return newCircle;
	});
	return newCircles;
} 

const calcGrids = (preCircleObj, newCircleObj, params, s) => {
	const preGrids = preCircleObj.isInit? Array.from(Array(newCircleObj.gridNum), () => 1): preCircleObj.grids;
	return preGrids.map((preGrid, gridIndex) => {
		const newGrid = {};
		const calcId = () => {
			const x = Math.floor(gridIndex / params.circle.gridPieceNum);
			const y = gridIndex % params.circle.gridPieceNum;
			return s.createVector(x, y);
		}
		newGrid.id = preCircleObj.isInit? calcId(): preGrid.id;
		const calcOriginPos = () => {
			const x = newGrid.id.x * newCircleObj.gridSize;
			const y = newGrid.id.y * newCircleObj.gridSize;
			return s.createVector(x, y);
		}
		newGrid.originPos = preCircleObj.isInit? calcOriginPos(): preGrid.originPos;
		newGrid.centerPos = p5.Vector.add(newGrid.originPos, s.createVector(newCircleObj.gridSize * 0.5, newCircleObj.gridSize * 0.5));
		const calcIsUpdateTargetAngle = () => {
			const p = Math.random();
			if (p < params.circle.angleChangeProb) return true;
			return false;
		}
		newGrid.isUpdateTargetAngle = calcIsUpdateTargetAngle();
		const calcCircleTargetAngle = () => {
			const p = Math.random();
			if (p < 0.25) { return Math.PI * 0.5 } // right
			else if (p < 0.5) { return Math.PI } // below
			else if (p < 0.75) { return Math.PI * 1.5 } // left
			else { return 0 }; // above
		}
		newGrid.circleTargetAngle = (preCircleObj.isInit || newGrid.isUpdateTargetAngle)? calcCircleTargetAngle(): preGrid.circleTargetAngle;
		const calcCircleAngle = () => {
			const diff = newGrid.circleTargetAngle - preGrid.circleAngle;
			const progress = diff * params.circle.angleEasingF;
			return preGrid.circleAngle + progress;
		}
		newGrid.circleAngle = preCircleObj.isInit? newGrid.circleTargetAngle: calcCircleAngle();
		newGrid.circleOffset = s.map(newCircleObj.currentMousePos.y, 0, params.size, newCircleObj.gridSize * params.circle.minCenterOffsetRate, newCircleObj.gridSize * params.circle.maxCenterOffsetRate);
		newGrid.circleOffsetInterval = newGrid.circleOffset / newCircleObj.circleNum;
		const newCircles = calcCircles(preGrid, newGrid, preCircleObj, newCircleObj, params, s);
		return { ...newGrid, circle: newCircles };
	});
}

export const calcCircleObj = (preCircleObj, params, s) => {
	const newCircleObj = {};
	newCircleObj.isInit = false;
	const calcIsUpdateTargetMousePos = () => {
		const p = Math.random();
		if (p < params.circle.mouseChangeProb) return true;
		return false;
	}
	newCircleObj.isUpdateTargetMousePos = calcIsUpdateTargetMousePos();
	const calcTargetMousePos = () => {
		const calcX = () => {
			const p = Math.random();
			if (p < 0.33) { return 0 } // right
			else if (p < 0.66) { return params.size * 0.5} // middle
			else { return params.size }; // left
		}
		const calcY = () => {
			const p = Math.random();
			if (p < 0.33) { return 0 } // above
			else if (p < 0.66) { return params.size * 0.5} // middle
			else { return params.size }; // below
		}
		return s.createVector(calcX(), calcY());
	}
	newCircleObj.targetMousePos = (preCircleObj.isInit | newCircleObj.isUpdateTargetMousePos)? calcTargetMousePos(): preCircleObj.targetMousePos;
	const calcCurrentMousePos = () => {
		const diff = p5.Vector.sub(newCircleObj.targetMousePos, preCircleObj.currentMousePos);
		const progress = p5.Vector.mult(diff, params.circle.mouseEasigF);
		return p5.Vector.add(preCircleObj.currentMousePos, progress);
	}
	newCircleObj.currentMousePos = preCircleObj.isInit? newCircleObj.targetMousePos: calcCurrentMousePos();
	const calcMousePosTargetDist = () => {
		if (preCircleObj.isInit) return 0;
		if (newCircleObj.isUpdateTargetMousePos) return p5.Vector.dist(newCircleObj.targetMousePos, preCircleObj.targetMousePos);
		return preCircleObj.mousePosTargetDist;
	}
	newCircleObj.mousePosTargetDist = calcMousePosTargetDist();
	const calcProgress = () => {
		if (newCircleObj.mousePosTargetDist === 0) return 0;
		const currentDist = p5.Vector.dist(newCircleObj.currentMousePos, newCircleObj.targetMousePos);
		return 1 - currentDist / newCircleObj.mousePosTargetDist;
	}
	newCircleObj.progress = preCircleObj.isInit? 0: calcProgress();
	const calcTargetColor = () => {
		const colors = [
			s.color(103, 170, 249, params.circle.colorAlpha),
			s.color(155, 189, 249, params.circle.colorAlpha),
			s.color(196, 224, 249, params.circle.colorAlpha),
			s.color(185, 95, 137, params.circle.colorAlpha),
		];
		const index = Math.floor(Math.random() * 4);
		return colors[index];
	}
	newCircleObj.targetColor = (preCircleObj.isInit | newCircleObj.isUpdateTargetMousePos)? calcTargetColor(): preCircleObj.targetColor;
	newCircleObj.currentColor = (preCircleObj.isInit)? newCircleObj.targetColor: s.lerpColor(preCircleObj.currentColor, newCircleObj.targetColor, newCircleObj.progress);
	newCircleObj.gridNum = preCircleObj.isInit? Math.pow(params.circle.gridPieceNum, 2): preCircleObj.gridNum;
	newCircleObj.gridSize = preCircleObj.isInit? params.size / params.circle.gridPieceNum: preCircleObj.gridSize;
	newCircleObj.circleNum = Math.floor(s.map(newCircleObj.currentMousePos.x, 0, params.size, params.circle.minCircleNum, params.circle.maxCircleNum));
	const newGrids = calcGrids(preCircleObj, newCircleObj, params, s);
	return { ...newCircleObj, grids: newGrids };
}

export const drawCircleObj = (circleObj, s) => {
	s.push();
	s.noStroke(0);
	s.fill(circleObj.currentColor);
	for (const grid of circleObj.grids) {
		for (const circle of grid.circle) s.circle(circle.centerPos.x, circle.centerPos.y, circle.radius);
	}
	s.pop();
}
