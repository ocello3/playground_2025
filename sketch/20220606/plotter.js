const init = (params, tab, s) => {
	params.plotter = {
		num: 3000,
		xPosSD: 10,
		yPosSD: 10,
		rSD: 5,
		gSD: 7,
		bSD: 7,
		boldRate: 100,
	}
	const _param = params.plotter;
	const _tab = tab.pages[1];
	_tab.addInput(_param, 'xPosSD', { step: 1, min: 1, max: 50 });
	_tab.addInput(_param, 'yPosSD', { step: 1, min: 1, max: 50 });
	_tab.addInput(_param, 'rSD', { step: 1, min: 1, max: 50 });
	_tab.addInput(_param, 'gSD', { step: 1, min: 1, max: 50 });
	_tab.addInput(_param, 'bSD', { step: 1, min: 1, max: 50 });
	_tab.addInput(_param, 'boldRate', { step: 10, min: 10, max: 500 });
	const { num } = _param;
	const obj = {};
	obj.plotters = Array.from(Array(num), () => false);
	return obj;
}

const update = (preObj, params, s) => {
	const { xPosSD, yPosSD, rSD, gSD, bSD } = params.plotter;
	const newObj = { ...preObj };
	newObj.plotters = preObj.plotters.map((prePlotter, plotterIndex) => {
		// const { pos } = preplotter; //
		const newPlotter = { ...prePlotter };
		newPlotter.pos = (() => {
			const x = s.randomGaussian(params.size / 2, params.size / xPosSD);
			const y = s.randomGaussian(params.size / 2, params.size / yPosSD);
			return s.createVector(x, y);
		})();
		newPlotter.color = (() => {
			return {
				r: s.randomGaussian(params.size / 2, params.size / rSD),
				g: s.randomGaussian(params.size / 2, params.size / gSD),
				b: s.randomGaussian(params.size / 2, params.size / bSD),
			}	
		})();
		return newPlotter;
	});
	return newObj;
}

const draw = (obj, params, s) => {
	const { boldRate } = params.plotter;
	s.push();
	for (const plotter of obj.plotters) {
		const { pos, color } = plotter;
		s.strokeWeight(params.size/boldRate);
		s.stroke(color.r, color.g, color.b);
		s.point(pos.x, pos.y);
	}
	s.pop();
}

export const plotter = { init, update, draw };
