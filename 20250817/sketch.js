import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";
import { getParams } from "./params.js";

const sketch = (s) => {
	let p, size, dt, snd;
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = getParams();
		p = u.safe(p, p);
		snd = (() => {
			const snd = {};
			return snd;
		})();
		const f = u.createPane(s, p, () => {
			// (activate) snd.osc.start());
		});
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
	};
	s.draw = () => {
		function getDt(_dt, p, s) {
			let dt = { ..._dt };
			dt.pos = p.isInit ? s.createVector(0, 0) : s.createVector(s.mouseX, s.mouseY);
			return dt;
		}
		dt = u.safe(getDt(dt, p, s), p);
		s.background(255);
		u.drawFrame(s, size);
		u.debug(s, p, dt, 3);
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
		if (p.isInit) { p.isInit = false; }
		function drawDt() {
			s.fill(0);
			s.circle(dt.pos.x, dt.pos.y, 50);
		}
		drawDt();
		function playSnd() {}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};

new p5(sketch);