import "../../lib/p5.min.js";
import "../../lib/p5.sound.min.js";
import * as u from "./util.js";
import { getParams } from "./params.js";

const sketch = (s) => {
	let p, size, dt, snd = {};
	s.preload = () => {
		s.soundFormats('wav');
		snd.rain = s.loadSound('./rain.wav');
	}
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = getParams();
		snd.rain.loop();
		snd.amp = new p5.Amplitude();
		snd.amp.setInput(snd.rain);
		snd.fft = new p5.FFT();
		snd.fft.setInput(snd.rain);
		snd.onset = new p5.OnsetDetect(p.detectMinFreq, p.detectMinFreq + p.detectFreqRange, p.detectThresh, () => {
				p.isDetect = true;
				console.log('detected');
			});
		// snd.onset.setInput(snd.rain);
		const f = u.createPane(s, p, () => {
			// (activate) snd.osc.start());
			snd.rain.play();
		});
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
		f2.addBinding(p, 'minFreq', {
			min: 0,
			max: 22000,
		}).on('change', (ev) => {
			if (ev.value > p.maxFreq) {
				p.maxFreq = ev.value + 1;
				f.refresh();
			}
			p.isMoved = true;
		});
		f2.addBinding(p, 'maxFreq', {
			min: 0,
			max: 22000,
		}).on('change', (ev) => {
			if (ev.value < p.minFreq) {
				p.minFreq = ev.value - 1;
				f.refresh();
			}
			p.isMoved = true;
		});
		f2.addBinding(p, 'detectMinFreq', {
			min: 0,
			max: 22000,
		}).on('change', (ev) => {
			snd.onset.freqLow = ev.value;
			const detectMaxFreq = ev.value + p.detectFreqRange;
			if (ev.value < p.minFreq) {
				p.minFreq = ev.value - 1;
				f.refresh();
			}
			if (detectMaxFreq > p.maxFreq) {
				p.maxFreq = detectMaxFreq + 1;
				f.refresh();
			}
			p.isMoved = true;
		});
		f2.addBinding(p, 'detectFreqRange', {
			min: 10,
			max: 5000,
		}).on('change', (ev) => {
			const detectMaxFreq = p.detectMinFreq + ev.value;
			snd.onset.freqHigh = detectMaxFreq;
			if (detectMaxFreq > p.maxFreq) {
				p.maxFreq = detectMaxFreq + 1;
				f.refresh();
			}
			p.isMoved = true;
		});
		f2.addBinding(p, 'detectThresh', {
			min: 0.001,
			max: 1,
		}).on('change', (ev) => {
			snd.onset.threshold = ev.value;
			p.isMoved = true;
		});
		s.textSize(p.fontSizeRate * size);
	};
	s.draw = () => {
		function updateSnd() {
			const nyquist = s.sampleRate() / 2;
			let low = snd.onset.freqLow;
			let high = snd.onset.freqHigh;
			if (low >= high) return;
			snd.onset.update(snd.fft);
		}
		updateSnd();

		function getDt(_dt) {
			let dt = { ..._dt };
			dt.dsp = (() => {
				let dsp = {};
				dsp.fftSize = p.isInit ? p.bins * 2 : _dt.dsp.fftSize;
				dsp.resolusion = p.isInit ? s.sampleRate() / dsp.fftSize : _dt.dsp.resolusion;
				dsp.spec = snd.fft.analyze();
				dsp.block = p.isInit ? s.sampleRate() / dsp.fftSize : _dt.dsp.block;
				dsp.scale = p.isInit ? dsp.spec.map((_, i) => i * dsp.block) : _dt.dsp.scale;
				return dsp;
			})();
			dt.bin = (p.isInit || p.isMoved) ? (() => {
				// calc displayed bin index
				let bin = {};
				bin.min = s.floor(p.minFreq / dt.dsp.block);
				const t_max = s.floor(p.maxFreq / dt.dsp.block);
				bin.max = t_max > bin.min ? t_max : bin.min + 1;
				bin.count = bin.max - bin.min;
				// calc peak detection range
				const detectMin = s.floor(p.detectMinFreq / dt.dsp.block);
				const detectMax = s.floor((p.detectMinFreq + p.detectFreqRange) / dt.dsp.block);
				const detectDiff = detectMax - detectMin;
				bin.detectCount = detectDiff > 0 ? detectDiff : 0;
				bin.detectId0 = detectMin - bin.min;
				return bin;
			})() : _dt.bin;
			dt.fft = dt.dsp.spec
				.filter((_, i) => i >= dt.bin.min && i < dt.bin.max)
				.map((amp, index) => {
					const fft = {};
					fft.w = size / dt.bin.count;
					fft.h = s.map(amp, 0, 255, 0, size);
					fft.x = fft.w * index;
					fft.y = size - fft.h;
					return fft;
				});
			dt.detectLevel = (() => {
				if (p.isInit) return 0;
				if (p.isDetect) return 100;
				const newLevel = _dt.detectLevel - 3;
				if (newLevel < 0) return 0;
				return newLevel;
			})();
			dt.scale = (p.isInit || p.isMoved) ? Array(p.labels).fill(0).map((_, i) => {
				let scale = {};
				const displayScale = dt.dsp.scale.filter((_, i) => i >= dt.bin.min && i < dt.bin.max);
				scale.binIndex = s.floor(dt.bin.count / p.labels) * i;
				const freq = s.floor(displayScale[scale.binIndex]) / 1000;
				const order = freq > 0 ? Math.floor(Math.log10(freq)) : 0;
				const factor = Math.pow(10, order);
				scale.value = freq === 0 ? 0 : Math.floor(freq / factor) * factor;
				const x = size / p.labels * i;
				const y = size * 0.1;
				scale.pos = s.createVector(x, y);
				return scale;
			}) : _dt.scale;
			dt.arrow = (() => {
				const arrow = {};
				const y = size * 0.2;
				const left = dt.fft[dt.bin.detectId0 + 1];
				const right = dt.fft[dt.bin.detectId0 + dt.bin.detectCount - 1];
				arrow.isDraw = (left != undefined) && (right != undefined);
				arrow.start = arrow.isDraw ? s.createVector(left.x, y) : 0;
				arrow.end = arrow.isDraw ? s.createVector(right.x, y) : 0;
				return arrow;
			})();
			return dt;
		}
		dt = getDt(dt);
		s.background(255);
		u.drawFrame(s, size);
		u.debug(s, p, p, 2);
		p.frameRate = s.isLooping() ? s.frameRate() : 0;

		function playSnd() {
			// snd.onset.update(snd.fft);
		}
		playSnd();

		function drawDt() {
			s.noStroke();
			dt.fft.forEach((fft, i) => {
				if (i > dt.bin.detectId0 && i < (dt.bin.detectId0 + dt.bin.detectCount)) {
					s.fill(255, 0, 0, s.map(dt.detectLevel, 0, 100, 255, 0));
				} else {
					s.fill(50);
				}
				s.rect(fft.x, fft.y, fft.w, fft.h);
			});
			dt.scale.forEach(scale => {
				s.push();
				s.fill(0);
				s.textSize(size * 0.03);
				s.translate(scale.pos.x, scale.pos.y);
				s.text(scale.value, 0, 0, 10);
				s.pop();
			});
			if (dt.arrow.isDraw) {
				s.stroke(255, 0, 0, s.map(dt.detectLevel, 0, 100, 255, 0));
				s.strokeWeight(size * 0.01);
				s.line(dt.arrow.start.x, dt.arrow.start.y, dt.arrow.end.x, dt.arrow.end.y);
			}
		}
		drawDt();

		// itit params
		p.isMoved = false;
		p.isDetect = false;
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};

new p5(sketch);