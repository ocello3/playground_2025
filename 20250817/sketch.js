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
			dt.analysis = (() => {
				// presude code before analyze sound
				let analysis = {};
				analysis.volume = s.noise(0.005 * s.frameCount);
				analysis.isTrigger = analysis > p.volThres;
				return analysis;
			});
			dt.charIndex = (() => {
				if (p.isInit) return 0;
				if (!dt.analysis.isTrigger) return _dt.charIndex;
				if (_dt.charIndex  < p.sentense.length) return 0;
				return _dt.charIndex + 1;
			})();
			dt.chars = p.isInit || dt.charIndex == p.sentense.length - 1 ?
				[...Array(p.sentense.length)].map(() => 0) :
				_dt.chars.map((_char, index) => {
					if (index < dt.charIndex) return _char;
					let char = { ..._char };
					char.isInit = _char == 0 ? true : false;
					char.type = char.isInit ? p.sentense.charAt(index) : _char.type;
					char.fontSize = char.isInit ? p.fontSizeRate * size : _char.fontSize;
					if (char.isInit) s.textSize(char.fontSize);
					char.widthRate = char.isInit ? 0 : _char.widthRate + dt.analysis.volume * p.charWidth;
					char.width = char.fontSize * char.widthRate;
					char.pos = (() => {
						if (index = 0) return s.createVector(0, size * 0.5);
						if (!char.isInit) return _char.pos;
						return p5.Vector.add(_char.pos, s.createVector(_char.width, 0));
					})();
					return char;
				});
			return dt;
		}
		dt = u.safe(getDt(dt, p, s), p);
		s.background(255);
		u.drawFrame(s, size);
		u.debug(s, p, dt, 3);
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
		if (p.isInit) { p.isInit = false; }
		function drawDt() {
			dt.chars.forEach((char, index) => {
				if (index > dt.charIndex) return 0;
				s.scale(char.widthRate, 1);
				s.text(char.type, char.pos.x, char.po.y);
			});
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