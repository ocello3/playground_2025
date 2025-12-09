export const setDropParams = (params) => {
	const drop = {};
	drop.num = 10;
	drop.shearXAngle = Math.PI/10;
	drop.maxAccY = 0.5;
	drop.maxInitVelY = 2;
	drop.maxInitPosYRate = 0.2;
	drop.maxLineWeight = 5;
	drop.maxLineLenthRate = 0.5;
	drop.layerPosArray = Array.from(Array(3), (_, index) => params.size / 4 * (index + 1));
	params.drop = drop;
}

const setData = (params, s) => {
	const data = {};
	// 速度は「うっすら加速する」程度
	data.accY = Math.random() * params.drop.maxAccY;
	data.velY = Math.random() * params.drop.maxInitVelY;
	const calcInitPos = () => {
		// 開始時、あるいは初期化時に位置を負(画面外)とすることで、落下開始のタイミングをずらす。
		const x = Math.random() * params.size;
		const y = (-1) * Math.random() * params.size * params.drop.maxInitPosYRate;
		return s.createVector(x, y);
	}
	// 破線の太さの初期値は初速が早ければ太く、遅ければ細くする。
	data.lineWeight = params.drop.maxLineWeight * data.velY/params.drop.maxInitVelY;
	data.pos = calcInitPos();
	const x = data.pos.x;
	const calcStartPos = () => {
		// 破線の始点は上1/3でランダムとする。
		const min = 0;
		const max = params.size * params.drop.maxLineLenthRate;
		const diff = max - min;
		const y = Math.random() * diff + min;
		return s.createVector(x, y);
	}
	data.isDraw = false;
	data.startPos = calcStartPos();
	const calcLength = () => {
		// 破線の長さは画面サイズ1/3でランダムとする。
		const max = params.size * params.drop.maxLineLenthRate;
		return Math.random() * max;
	}
	const calcEndPos = () => {
		const length = calcLength();
		const y = data.startPos.y + length;
		return s.createVector(x, y);
	}
	data.endPos = calcEndPos();
	data.progress = 0;
	data.isCollisionArray = [false, false, false]; // 各レイヤーとの衝突判定
	return data;
}

export const setDrops = (params, s) => {
	const drops = {};
	drops.dataArray = Array.from(Array(params.drop.num), () => setData(params, s));
	return drops;
}

const updateData = (preData) => (params, s) => {
	const newData = { ...preData };
	newData.velY = preData.velY + preData.accY;
	const updatePos = () => {
		const x = preData.pos.x;
		const y = preData.pos.y + newData.velY;
		return s.createVector(x, y);
	}
	newData.pos = updatePos();
	const updateProgress = () => {
		const progressLength = newData.pos.y - preData.startPos.y;
		const totalLength = preData.endPos.y - preData.startPos.y;
		return progressLength / totalLength;
	}
	newData.progress = updateProgress();
	// 地面に落ちた時、初期化(位置、始点、長さを再計算)する。
	if (newData.pos.y > params.size) return setData(params, s);
	const calcIsDraw = () => {
		const isOverStart = (newData.pos.y > preData.startPos.y);
		const isWithinEnd = (newData.pos.y < preData.endPos.y);
		return (isOverStart && isWithinEnd);
	}
	newData.isDraw = calcIsDraw();
	const calcIsCollision = (layerPos) => {
		const isPreCondition = (newData.pos.y > layerPos);
		const isPostCondition = (preData.pos.y < layerPos);
		return (isPreCondition && isPostCondition);
	}
	const calcIsCollisionArray = () => {
		return params.drop.layerPosArray.map(layerPos => calcIsCollision(layerPos));
	}
	newData.isCollisionArray = calcIsCollisionArray();
	return newData;
}

export const updateDrops = (preDrops, params, s) => {
	const newDrops = { ...preDrops };
	newDrops.dataArray = preDrops.dataArray.map((preData) => updateData(preData)(params, s));
	return newDrops;
};

const drawDrop = (data, params, s) => {
	if (data.isDraw === false) return false; // 描画しない
	s.push();
	s.shearX(params.drop.shearXAngle);
	s.strokeCap(s.ROUND);
	s.stroke(0, 255 * (1 - data.progress)); // 徐々に薄くなる
	s.strokeWeight(data.lineWeight);
	s.line(data.startPos.x, data.startPos.y, data.pos.x, data.pos.y);
	s.pop();
	return false;
}

export const drawDrops = (drops, params, s) => {
	for (const data of drops.dataArray) drawDrop(data, params, s);
	return false;
}
