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
		snd.onset = new p5.OnsetDetect(0.1, 2000); // threshold, decay
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
				dsp.scale = p.isInit ? dsp.spec.map((_, i) => i * (s.sampleRate() / dsp.fftSize)) : _dt.dsp.scale;
				dsp.isDetect = snd.onset.detect(snd.fft);
				return dsp;
			})();
			dt.bin = (p.isInit || p.isMoved) ? (() => {
				// calc displayed bins
				let bin = {};
				bin.min = s.floor(p.minFreq / (s.sampleRate() / dt.dsp.fftSize));
				const t_max = s.floor(p.maxFreq / (s.sampleRate() / dt.dsp.fftSize));
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
		p.isMoved = false;

		function drawDt() {
			if (dt.dsp.isDetect) {
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

		function playSnd() {}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};

new p5(sketch);