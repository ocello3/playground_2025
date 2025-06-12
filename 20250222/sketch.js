import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";
import * as e from "./effect.js";

const sketch = (s) => {
	let size, dt = {}, snd = {};
	let p = {
		// default
		isInit: true,
		play: false,
		vol: 0,
		frameRate: 0,
		// sketch
		// sound
		drop: {
			num: 5,
			interval: 10,
		},
	};
	const f = u.createPane(s, p, snd);
	const f1 = f.addFolder({
		title: "sketch",
	});
	s.setup = () => {
		s.createCanvas().parent("canvas");
		size = u.getSize(s);
		// s.frameRate(10);
		s.noLoop();
		s.outputVolume(0);
	};

	s.draw = () => {
		const _drops = p.isInit ? Array.from({ length: p.drop.num }) : dt.drops;
		dt.count = s.frameCount;
		dt.drops = _drops.map((_drop) => {
			const drop = {..._drop};
			drop.status = (() => {
				///最初は全部'waiting'にして段階的に'init'にしてもよい
				if (p.isInit === true) return 'init';
				const isOverX = _drop.pos.x < 0 || _drop.pos.x > size;
				const isOverY = _drop.pos.y < 0 || _drop.pos.y > size;
				if (isOverX || isOverY) return 'init';
				return 'update';
			})();
			drop.acc = (() => {
				const x = 2 * s.sin(dt.count * 0.05);
				const y = drop.status === 'init' ? s.random(1, 2) : _drop.acc.y;
				return new p5.Vector(x, y);
			})();
			drop.pos = (() => {
				if (drop.status === 'init') return new p5.Vector.mult(p5.Vector.random2D(), size);
				return p5.Vector.add(_drop.pos, drop.acc);
			})();
			//sizeを追加する
			return drop;
		})
		//effect
		s.background(255);
		e.drawDrop(s, dt);
		s.noStroke();
		u.drawFrame(s, size);
		e.playOsc(s, p, snd, dt);
		u.debug(s, p, dt.drops[0]); // s, p, arg, displayArrayLength, startPosition, refreshInterval
		// これもutilに移して、frameCountも移して、updatrPとかにする？
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};
new p5(sketch);

