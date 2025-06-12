import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";

/*
前のフレームを保管して残像を残す
タッチ数: 3
*/

const sketch = (s) => {
	let size, dt, snd;
	let p = {
		play: false,
		vol: 0,
		frameRate: 0,
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
		function activate() {
			snd.osc.start();
		}
		const f = u.createPane(s, p, activate);
		const f1 = f.addFolder({ title: "sketch" });
		s.noLoop();
		s.outputVolume(0);
	};
	s.draw = () => {
		function getDt(_dt) {
			dt = {};
			dt.isTouch = s.touches.length != 0;
			dt.snd = (() => {
				const track = (() => {
					const track = {};
					// 数フレーム保存する
					return track;
				})();
				const snd = {};
				snd.pan = dt.isTouch ? s.map(s.mouseX, 0, size, -1, 1) :  size * 0.5;
				snd.vol = dt.isTouch ? s.map(s.mouseY, 0, size, 0, 1) : 0;
				return snd;
			})();
			return dt;
		}
		dt = getDt();
		function routine() {
			s.background(255);
			s.noStroke();
			u.drawFrame(s, size);
			u.debug(s, p, dt); // 4-length, 5-startPos, 6-refreshInterval
			p.frameRate = s.isLooping() ? s.frameRate() : 0;
		}
		routine();
		function playSnd() {
			snd.osc.pan(dt.snd.pan);
			snd.osc.amp(dt.snd.vol);
		}
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};
new p5(sketch);
