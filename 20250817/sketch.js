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
		function getDt(_dt, p, s) {
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
				if (_dt.charIndex + 2 == p.sentense.length) return 0;
				return _dt.charIndex + 1;
			})();
			dt.isInit = dt.charIndex == 0;
			dt.chars = dt.isInit ?
				[...Array(p.sentense.length)].map(() => 0) :
				_dt.chars.map((_char, index, _chars) => {
					let char = { ..._char };
					char.isInit = _char == 0 ? true : false;
					char.isUpdate = dt.charIndex == index;
					if (!char.isUpdate) return _char;
					if (char.isInit) { // not updated
						char.type = p.sentense.charAt(index);
						char.pos = (() => {
							if (index == 0) return s.createVector(0, size * 0.5);
							const prePos = _chars[index - 1].pos;
							const preWidth = _chars[index - 1].width;
							return p5.Vector.add(prePos, s.createVector(preWidth, 0));
						})();
					}
					if (char.isUpdate) {
						char.widthRate = char.isInit ?
							0 :
							_char.widthRate + dt.analysis.volume * p.charWidth;
						char.width = s.textWidth(char.type) * char.widthRate;
					}
					return char;
				});
			return dt;
		}
		dt = getDt(dt, p, s);
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