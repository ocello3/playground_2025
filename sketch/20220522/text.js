export const setTextParams = (params, tab) => {
	params.text = {
		velocityRate: 0.08,
		text: 'p5js',
		nextText: '',
		reset: false,
	};
	tab.pages[1].addInput(params.text, 'velocityRate', { min: 0.005, max: 0.02 });
	tab.pages[0].addBlade({
		view: 'text',
		label: 'text',
		parse: (v) => { params.text.nextText = String(v) },
		value: params.text.nextText,
	});
	const resetBtn = tab.pages[0].addButton({
		title: 'set/start',
		label: 'reset',
	});
	resetBtn.on('click', () => {
		params.text.text = params.text.nextText;
		params.text.reset = true;
	});
	return false;
}

export const calcTextObj = (preTextObj, params, s) => {
	const newTextObj = {};
	if (preTextObj.isInit || params.text.reset === true) s.textSize(params.size * 0.7);
	newTextObj.textWidth = (preTextObj.isInit || params.text.reset === true) ? s.textWidth(params.text.text) : preTextObj.textWidth;
	newTextObj.isReset = params.text.reset;
	newTextObj.isOver = preTextObj.isInit ? false : preTextObj.pos.x < (-1) * newTextObj.textWidth;
	const calcPos = () => {
		const x = (preTextObj.isInit || newTextObj.isReset || newTextObj.isOver) ? 0 : preTextObj.pos.x - params.size * params.text.velocityRate;
		const y = preTextObj.isInit ? params.size * 0.5 : preTextObj.pos.y;
		return s.createVector(x, y);
	}
	newTextObj.pos = calcPos();
	if (newTextObj.isInit) { newTextObj.isInit = false; }
	if (params.text.reset) { params.text.reset = false; }
	return newTextObj;
}

export const drawText = (textObj, pg, params) => {
	pg.background(0);
	pg.push();
	pg.fill(255);
	pg.textStyle(pg.BOLD);
	pg.textSize(params.size * 0.9);
	pg.textAlign(pg.LEFT, pg.CENTER);
	pg.text(params.text.text, textObj.pos.x, textObj.pos.y);
	pg.pop();
}