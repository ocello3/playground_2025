// 3層目

export const setRippleParams = (params) => {
	const ripple = {};
	ripple.deformationRate = 0.25;
	ripple.sizeReducRate = 0.3;
	ripple.angleWidthInc = Math.PI * 0.0015;
	params.ripple = ripple;
}

const setData = () => {
	const data = {};
	data.status = 'wait'; // 'update' or 'reset'
	return data;
}

export const setRipples = (dropsDataArray) => {
	const repples = {};
	repples.dataArray = dropsDataArray.map(() => setData());
	return repples;
}

const updateData = (preData) => (dropsData, params, s) => {
	const newData = { ...preData };
	const updateStatus = () => {
		const isCollision = dropsData.isCollisionArray[2];
		if (preData.status === 'wait') {
			if (isCollision === false) return 'wait';
			if (isCollision === true) return 'reset';
			throw isCollision;
		}
		if (preData.status === 'reset') return 'update';
		if (preData.status === 'update') {
			if (isCollision === false) return 'update';
			if (isCollision === true) return 'reset';
			throw isCollision;
		}
		throw preData.status;
	}
	newData.status = updateStatus();
	if (newData.status === 'wait') return preData; // 以降ではresetとupdateのみを考慮する。
	const calcCenterPos = () => {
		if (newData.status === 'reset') {
			const x = dropsData.pos.x;
			const y = params.drop.layerPosArray[2];
			return s.createVector(x, y);
		}
		if (newData.status === 'update') return preData.centerPos;
		throw newData.status;
	}
	newData.centerPos = calcCenterPos();
	const calcCollisionVelY = () => {
		if (newData.status === 'reset') return dropsData.velY;
		if (newData.status === 'update') return preData.collisionVelY;
		throw newData.status;
	}
	newData.collisionVelY = calcCollisionVelY();
	const calcSize = () => {
		if (newData.status === 'reset') return s.createVector(0, 0);
		if (newData.status === 'update') {
			const width = preData.size.x + newData.collisionVelY * params.ripple.sizeReducRate;
			const height = width * params.ripple.deformationRate;
			return s.createVector(width, height);
		}
	}
	newData.size = calcSize();
	const calcAngleWidth = () => {
		if (newData.status === 'reset') return 0;
		if (newData.status === 'update') return preData.angleWidth + params.ripple.angleWidthInc;
		throw newData.status;
	}
	newData.angleWidth = calcAngleWidth();
	newData.rightStart = (-1) * newData.angleWidth * 0.5;
	newData.rightEnd = newData.angleWidth * 0.5;
	newData.leftStart = Math.PI - newData.angleWidth * 0.5;
	newData.leftEnd = Math.PI + newData.angleWidth * 0.5;
	newData.progress = newData.angleWidth / Math.PI;
	newData.alpha = 200 * (1 - newData.progress * 2);
	const calcLineWeight = () => {
		if (newData.status === 'reset') return dropsData.lineWeight/4;
		if (newData.status === 'update') return preData.lineWeight;
		throw newData.status;
	}
	newData.lineWeight = calcLineWeight();
	return newData;
}

export const updateRipples = (preRipples, newDropsDataArray, params, s) => {
	const newRipples = { ...preRipples };
	newRipples.dataArray = preRipples.dataArray.map((preData, index) => updateData(preData)(newDropsDataArray[index], params, s));
	return newRipples;
}

const drawRipple = (data, params, s) => {
	if (data.status === 'wait') return false; // 描画しない
	s.push();
	s.shearX(params.drop.shearXAngle);
	s.noFill();
	s.strokeWeight(data.lineWeight);
	s.stroke(0, data.alpha);
	s.arc(data.centerPos.x, data.centerPos.y, data.size.x, data.size.y, data.rightStart, data.rightEnd);
	s.arc(data.centerPos.x, data.centerPos.y, data.size.x, data.size.y, data.leftStart, data.leftEnd);
	s.pop();
	return false;
}

export const drawRipples = (drops, params, s) => {
	for (const data of drops.dataArray) drawRipple(data, params, s);
	return false;
}
