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
		snd.onset = new p5.OnsetDetect(p.detectMinFreq, p.detectMaxFreq, p.detectThresh, () => {
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
		}).on('change', () => {
			p.isMoved = true;
		});
		f2.addBinding(p, 'maxFreq', {
			min: 0,
			max: 22000,
		}).on('change', () => {
			p.isMoved = true;
		});
		f2.addBinding(p, 'detectMinFreq', {
			min: 0,
			max: 22000,
		}).on('change', (ev) => {
			snd.onset.freqLow = ev.value;
		});
		f2.addBinding(p, 'detectMaxFreq', {
			min: 0,
			max: 22000,
		}).on('change', (ev) => {
			snd.onset.freqHigh = ev.value;
		});
		f2.addBinding(p, 'detectThresh', {
			min: 0.001,
			max: 0.1,
		}).on('change', (ev) => {
			snd.onset.threshold = ev.value;
		});
		// set font size
		// s.textAlign(s.LEFT, s.TOP)
		s.textSize(p.fontSizeRate * size);
	};
	s.draw = () => {
		function getDt(_dt) {
			let dt = { ..._dt };
			dt.dsp = (() => {
				let dsp = {};
				dsp.fftSize = p.isInit ? p.bins * 2 : _dt.dsp.fftSize;
				dsp.resolusion = p.isInit ? s.sampleRate() / dsp.fftSize : _dt.dsp.resolution;
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
			dt.scale = (p.isInit || p.isMoved) ? Array(p.labels).fill(0).map((_, i) => {
				let scale = {};
				const displayScale = dt.dsp.scale.filter((_, i) => i >= dt.bin.min && i < dt.bin.max);
				scale.binIndex = s.floor(dt.bin.count / p.labels) * i;
				scale.value = s.floor(displayScale[scale.binIndex]);
				const x = size / p.labels * i;
				const y = size * 0.1;
				scale.pos = s.createVector(x, y);
				return scale;
			}) : _dt.scale;
			return dt;
		}
		dt = getDt(dt);
		s.background(255);
		u.drawFrame(s, size);
		u.debug(s, p, dt.bin, 10);
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
		
		function playSnd() {
			snd.onset.update(snd.fft);
		}
		playSnd();
		
		function drawDt() {
			if (p.isDetect) {
				s.fill(255, 0, 0);
			} else {
				s.fill(0);
			}
			dt.fft.forEach(fft => {
				s.rect(fft.x, fft.y, fft.w, fft.h);
			});
			dt.scale.forEach(scale => {
				s.push();
				s.textSize(size * 0.05);
				s.translate(scale.pos.x, scale.pos.y);
				s.rotate(s.HALF_PI);
				s.text(scale.value, 0, 0, 10);
				s.pop();
			});
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