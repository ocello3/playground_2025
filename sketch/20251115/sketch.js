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
			dt.dsp = (() => {
				let dsp = {};
				dsp.spec = snd.fft.analyze(); // ここから再開する
				/* 準備中　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
				dsp.fftSize = p.isInit ? p.bins * 2 : _dt.dsp.fftSize;
				dsp.binFreqWidth = p.isInit ? s.sampleRate() / dsp.fftSize : _dt.dsp.binFreqWidth;
				dsp.binFreqs = p.isInit ? Array(p.bins).fill(0).map((_, index) => index * dsp.binFreqWidth) : _dt.dsp.binFreqs;
				*/
				dsp.isTrigger = snd.peak.isDetected;
				return dsp;
			})();
			dt.fft = dt.dsp.spec.map((amp, index) => {
				const fft = {};
				fft.w = size / p.bins;
				fft.h = s.map(amp, 0, 255, 0, size);
				fft.x = fft.w * index;
				fft.y = size - fft.h;
				return fft;
			});
			return dt;
		}
		dt = getDt(dt);
		s.background(255);
		u.drawFrame(s, size);
		u.debug(s, p, dt, 5);
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
		function drawDt() {
			dt.fft.forEach(fft => {
				s.rect(fft.x, fft.y, fft.w, fft.h);
			});
		}
		drawDt();
		function playSnd() {
		}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};

new p5(sketch);