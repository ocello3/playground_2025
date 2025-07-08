import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";

/*
todo: done
*/

const sketch = (s) => {
	let p, size, dt, snd;
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = {
			play: false,
			isInit: true,
			vol: 0,
			frameRate: 0,
		};
		snd = (() => {
			const snd = {};
			return snd;
		})();
		// console.log(snd.oscs.head[0]);
		// s.frameRate(10);
		function activate() {
			// snd.osc.start();
		}
		const f = u.createPane(s, p, activate);
		const f1 = f.addFolder({ title: "sketch" });
	};
	s.draw = () => {
		function getDt(_dt) {
			dt = {};
			return dt;
		}
		dt = getDt(dt);
		function routine() {
			s.background(255);
			s.noStroke();
			u.drawFrame(s, size);
			u.debug(s, p, dt); // 4-length, 5-start, 6-refresh
			p.frameRate = s.isLooping() ? s.frameRate() : 0;
		}
		routine();
		function playSnd() {
		}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};
new p5(sketch);