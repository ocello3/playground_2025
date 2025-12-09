export const setCheckboxParams = (params, tab) => {
	params.checkbox = {
		pieceNum: 20,
		sizeRate: 0.002,
		blockNum: 3,
		threshold: 0.5,
		rectMarginRate: 0.2,
		rectRadiusRate: 0.2,
	};
	tab.pages[1].addInput(params.checkbox, 'sizeRate', { min: 0.0005, max: 0.005 });
	return false;
}
const calcCheckboxBlocks = (preCheckboxObj, newCheckboxObj, newCheckboxes, params, s) => {
	const blankArray = Array.from(Array(Math.pow(params.checkbox.blockNum, 2)), () => 1);
	const preCheckboxBlocks = preCheckboxObj.isInit? blankArray: preCheckboxObj.checkboxBlocks;
	const newCheckboxBlocks = preCheckboxBlocks.map((preCheckboxBlock, blockIndex) => {
		const newCheckboxBlock = {};
		const calcId = () => {
			const x = blockIndex % params.checkbox.blockNum;
			const y = Math.floor(blockIndex / params.checkbox.blockNum);
			return s.createVector(x, y);
		}
		newCheckboxBlock.id = preCheckboxObj.isInit? calcId(): preCheckboxBlock.id;
		const calcPos = () => {
			const x = newCheckboxObj.blockInterval * newCheckboxBlock.id.x;
			const y = newCheckboxObj.blockInterval * newCheckboxBlock.id.y;
			return s.createVector(x, y);
		}
		newCheckboxBlock.pos = preCheckboxObj.isInit? calcPos(): preCheckboxBlock.pos;
		newCheckboxBlock.idInterval = preCheckboxObj.isInit? Math.floor(params.checkbox.pieceNum / params.checkbox.blockNum): preCheckboxBlock.idInterval;
		const calcCheckboxStartId = () => {
			const x = newCheckboxBlock.id.x * newCheckboxBlock.idInterval;
			const y = newCheckboxBlock.id.y * newCheckboxBlock.idInterval;
			return s.createVector(x, y);
		}
		newCheckboxBlock.checkboxStartId = preCheckboxObj.isInit? calcCheckboxStartId(): preCheckboxBlock.checkboxStartId;
		newCheckboxBlock.totalNum = Math.pow(newCheckboxBlock.idInterval, 2);
		const calcCheckedPosArray = () => {
			const posArray = [];
			for (const checkbox of newCheckboxes) {
				const isWithinXId = (checkbox.id.x >= newCheckboxBlock.checkboxStartId.x) && (checkbox.id.x < newCheckboxBlock.checkboxStartId.x + newCheckboxBlock.idInterval);
				const isWithinYId = (checkbox.id.y >= newCheckboxBlock.checkboxStartId.y) && (checkbox.id.y < newCheckboxBlock.checkboxStartId.y + newCheckboxBlock.idInterval);
				if (checkbox.switch && isWithinXId && isWithinYId) posArray.push(checkbox.pos);
			}
			return posArray;
		}
		const checkedPosArray = calcCheckedPosArray();
		newCheckboxBlock.checkedNum = checkedPosArray.length;
		newCheckboxBlock.checkedRate = newCheckboxBlock.checkedNum / newCheckboxBlock.totalNum;
		const checkedTotalPos = checkedPosArray.reduce((previousVec, currentVec) => p5.Vector.add(previousVec, currentVec), s.createVector(0, 0));
		newCheckboxBlock.checkedAveragePos = (newCheckboxBlock.checkedNum === 0)? s.createVector(0, 0): p5.Vector.div(checkedTotalPos, newCheckboxBlock.checkedNum);
	return newCheckboxBlock;
});
return newCheckboxBlocks;
}

const calcCheckboxes = (preCheckboxObj, newCheckboxObj, pg, params, s) => {
	const preCheckboxes = preCheckboxObj.isInit ? Array.from(Array(newCheckboxObj.num), () => 1) : preCheckboxObj.checkboxes;
	const newCheckboxes = preCheckboxes.map((preCheckbox, checkboxIndex) => {
		const newCheckbox = {};
		const calcId = () => {
			const xId = checkboxIndex % params.checkbox.pieceNum;
			const yId = Math.floor(checkboxIndex / params.checkbox.pieceNum);
			return s.createVector(xId, yId);
		}
		newCheckbox.id = preCheckboxObj.isInit ? calcId() : preCheckbox.id;
		const calcPosOffset = () => {
			const internalLength = (params.checkbox.pieceNum - 1) * newCheckboxObj.interval;
			const totalMargin = params.size - internalLength;
			return totalMargin * 0.5;
		}
		newCheckbox.posOffset = preCheckboxObj.isInit ? calcPosOffset() : preCheckbox.posOffset;
		const calcPos = () => {
			const xPos = newCheckboxObj.interval * newCheckbox.id.x + newCheckbox.posOffset;
			const yPos = newCheckboxObj.interval * newCheckbox.id.y + newCheckbox.posOffset;
			return s.createVector(xPos, yPos);
		}
		newCheckbox.pos = preCheckboxObj.isInit ? calcPos() : preCheckbox.pos;
		const calcSwitch = () => {
			const color = s.color(pg.get(newCheckbox.pos.x, newCheckbox.pos.y));
			const bright = (s.red(color) + s.green(color) + s.blue(color)) * 0.33;
			if (bright < params.checkbox.threshold) {
				return false;
			} else {
				return true;
			}
		}
		newCheckbox.switch = calcSwitch();
		return newCheckbox;
	});
	return newCheckboxes;
}

export const calcCheckboxObj = (preCheckboxObj, pg, params, s) => {
	const newCheckboxObj = {};
	newCheckboxObj.isInit = false;
	newCheckboxObj.num = preCheckboxObj.isInit ? Math.pow(params.checkbox.pieceNum, 2) : preCheckboxObj.num;
	newCheckboxObj.interval = preCheckboxObj.isInit ? params.size / params.checkbox.pieceNum : preCheckboxObj.interval;
	newCheckboxObj.blockInterval = preCheckboxObj.isInit ? params.size / params.checkbox.blockNum : preCheckboxObj.blockInterval;
	const newCheckboxes = calcCheckboxes(preCheckboxObj, newCheckboxObj, pg, params, s);
	const newCheckboxBlocks = calcCheckboxBlocks(preCheckboxObj, newCheckboxObj, newCheckboxes, params, s);
	return { ...newCheckboxObj, checkboxes: newCheckboxes, checkboxBlocks: newCheckboxBlocks };
}

export const updateCheckboxDoms = (pgMask, checkboxDoms, checkboxObj, params, s) => {
	/*
	checkboxDoms.forEach((checkboxDom, domIndex) => {
		const checkbox = checkboxObj.checkboxes[domIndex];
		checkboxDom.position(checkbox.pos.x, checkbox.pos.y);
		checkboxDom.checked(checkbox.switch);
	});
	*/
	// circle
	s.push();
	s.noStroke();
	for (const block of checkboxObj.checkboxBlocks) {
		const x = s.map(block.checkedAveragePos.x, 0, params.size, 0, 255);
		const y = s.map(block.checkedAveragePos.y, 0, params.size, 0, 255);
		const alpha = s.map(block.checkedRate, 0, 1, 150, 255);
		s.fill(x, y, 100, alpha);
		s.rect(block.pos.x, block.pos.y, checkboxObj.blockInterval);
	}
	s.pop();
	// checkboxes
	pgMask.background(255);
	pgMask.push();
	pgMask.noStroke();
	for (const checkbox of checkboxObj.checkboxes) {
		if (checkbox.switch) {
			// s.fill(0);
			pgMask.erase();
			const margin = checkboxObj.interval * params.checkbox.rectMarginRate * 0.5;
			const length = checkboxObj.interval - margin * 2;
			const marginVec = s.createVector(margin, margin);
			const pos = p5.Vector.add(checkbox.pos, marginVec);
			pgMask.rect(pos.x, pos.y, length, length, length * params.checkbox.rectRadiusRate);
		} else {
			// s.fill(255);
			// pgMask.noErase();
		}
	}
	pgMask.noErase();
	pgMask.pop();
	s.image(pgMask, 0, 0);
}