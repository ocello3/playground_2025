import "../../lib/p5.min.js";
import "../../lib/p5.sound.min.js";
import * as u from "./util.js";
import { getParams } from "./params.js";

const sketch = (s) => {
	let p, size, dt, snd;
	s.preload = () => {
		s.soundFormats('wav');
		snd = (() => {
			const snd = {};
			snd.rain = s.loadSound('./rain.wav');
			return snd;
		})();
	}
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = getParams();
		snd.rain.loop();
		snd.amp = new p5.Amplitude();
		snd.amp.setInput(snd.rain);
		snd.fft = new p5.FFT();
		snd.peak = new p5.PeakDetect(50, 1000, 0.07, 1); // freq1, freq2, threshold, framesPerPeak
		const f = u.createPane(s, p, () => {
			// (activate) snd.osc.start());
			snd.rain.play();
		});
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
		// set font size
		// s.textAlign(s.LEFT, s.TOP)
		s.textSize(p.fontSizeRate * size);
	};
	s.draw = () => {
		function getDt(_dt) {
			let dt = { ..._dt };
			dt.analysis = (() => {
				// presude code before analyze sound
				let analysis = {};
				analysis.volume = snd.amp.getLevel() * 250; // 200をパラメータにする。peak音量と文字数から計算できるとよい
				snd.fft.analyze();
				snd.peak.update(snd.fft);
				analysis.isTrigger = snd.peak.isDetected;
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
							const prePos = p.isInit ?
								s.createVector(size / p.grid, size / p.grid * 2) :
								_dt.chars[_dt.charIndex].pos;
							const preWidth = p.isInit ? 0 : _dt.chars[_dt.charIndex].width;
							const addedXpos = prePos.x + preWidth;
							const addedYpos = prePos.y + size / p.grid;
							if (addedXpos < size - (size / p.grid)) {
								return s.createVector(addedXpos, prePos.y);
							} else {
								if (addedYpos < (size / p.grid) * 5) {
									return s.createVector(size / p.grid, addedYpos);
								} else {
									return s.createVector(size / p.grid, size / p.grid * 2);
								}
							}
						})();
						char.sizeRate = 0;
						return char;
					}
					// update
					let char = { ..._dt.chars[index] };
					// char.sizeRate = _dt.chars[_dt.charIndex].sizeRate + dt.analysis.volume * p.charWidth; // 徐々に大きく
					char.sizeRate = dt.analysis.volume * p.charWidth * size;
					char.width = s.textWidth(char.type) * char.sizeRate;
					return char;
				}
				return _dt.chars[index]; // updated char
			});
			dt.snd = (() => {
				let snd = {};
				const x = dt.chars[dt.charIndex].pos.x;
				snd.pan = s.map(x, 0, size, -1, 1);
				return snd;
			})();
			return dt;
		}
		dt = getDt(dt);
		s.background(255);
		u.drawFrame(s, size);
		u.debug(s, p, dt, 20);
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
		function drawDt() {
			dt.chars.forEach((char, index) => {
				if (index > dt.charIndex) return 0;
				s.fill(0, 200);
				s.push();
				s.translate(char.pos.x, char.pos.y);
				s.scale(char.sizeRate, char.sizeRate);
				s.text(char.type, 0, 0);
				s.pop();
			});
		}
		drawDt();
		function playSnd() {
			snd.rain.pan(dt.snd.pan);
		}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};

new p5(sketch);