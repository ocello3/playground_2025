import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";

/*
前のフレームを保管して残像を残す
*/

const sketch = (s) => {
	let size, dt, snd;
	let p = {
		// default
		isInit: true,
		play: false,
		vol: 0,
		frameRate: 0,
		// sketch
		// sound
	};
	s.setup = () => {
		s.createCanvas().parent("canvas");
		size = u.getSize(s);
		snd = (()=> {
			const snd = {};
			snd.osc = new p5.Oscillator('sine');
			snd.osc.amp(0);
			return snd;
		})();
		// s.frameRate(10);
		const activate = () => {
			snd.osc.start();
		}
		const f = u.createPane(s, p, activate);
		const f1 = f.addFolder({ title: "sketch" });
		s.noLoop();
		s.outputVolume(0);
	};
	s.draw = () => {
		dt = (() => {
			dt = {};
			dt.isTouch = s.touches.length != 0;
			dt.pan = dt.isTouch ? s.map(s.mouseX, 0, size, -1, 1) :  size * 0.5;
			dt.vol = dt.isTouch ? s.map(s.mouseY, 0, size, 0, 1) : 0;
			return dt;
		})();
		//effect
		s.background(255);
		s.noStroke();
		u.drawFrame(s, size);
		// snd
		snd.osc.pan(dt.pan);
		snd.osc.amp(dt.vol);
		u.debug(s, p, dt); // 4-length, 5-startPos, 6-refreshInterval
		p.frameRate = s.isLooping() ? s.frameRate() : 0;
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};
new p5(sketch);
