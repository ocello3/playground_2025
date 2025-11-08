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
		snd = (() => {
			const snd = {};
			return snd;
		})();
		const f = u.createPane(s, p, () => {
			// (activate) snd.osc.start());
		});
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
		// set font size
		s.textSize(p.fontSizeRate * size);
	};
	s.draw = () => {
		function getDt(_dt) {
			let dt = { ..._dt };
			dt.analysis = (() => {
				// presude code before analyze sound
				let analysis = {};
				// 前のフレームより音が大きくなった時だけtriggerをonにする。でもpeakDetectみたいな関数欲しい
				// https://p5js.org/reference/p5.sound/p5.PeakDetect/
				// 仮で定期的にピークがオンになるような擬似にする
				analysis.volume = s.noise(0.05 * s.frameCount);
				analysis.isTrigger = s.frameCount % 60 === 0 ? true : false;
				return analysis;
			})();
			dt.charIndex = (() => {
				if (p.isInit) return 0;
				if (!dt.analysis.isTrigger) return _dt.charIndex;
				if (_dt.charIndex + 1 == p.sentense.length) return 0;
				return _dt.charIndex + 1;
			})();
			dt.chars = Array(p.sentense.length).fill(0).map((_, index) => {
				if (index > dt.charIndex) return 0; // waiting char
				if (dt.charIndex == index) { // updating char
					if (p.isInit || _dt.charIndex != dt.charIndex) { // init
						let char = {};
						char.type = p.sentense.charAt(index);
						char.pos = (() => {
							if (dt.charIndex == 0) return s.createVector(0, size * 0.5);
							const prePos = _dt.chars[_dt.charIndex].pos;
							const preWidth = _dt.chars[_dt.charIndex].width;
							return p5.Vector.add(prePos, s.createVector(preWidth, 0));
						})();
						char.widthRate = 0;
						return char;
					}
					// update
					let char = { ..._dt.chars[index] };
					char.widthRate = _dt.chars[_dt.charIndex].widthRate + dt.analysis.volume * p.charWidth;
					char.width = s.textWidth(char.type) * char.widthRate;
					return char;
				}
				return _dt.chars[index]; // updated char
			});
			return dt;
		}
		dt = getDt(dt);
		s.background(255);
		u.drawFrame(s, size);
		u.debug(s, p, dt, 20);
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
		if (p.isInit) { p.isInit = false; }
		function drawDt() {
			dt.chars.forEach((char, index) => {
				s.push();
				if (index > dt.charIndex) return 0;
				s.translate(char.pos.x, char.pos.y);
				s.scale(char.widthRate, 1);
				s.text(char.type, 0, 0);
				s.pop();
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