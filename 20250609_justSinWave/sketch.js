import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";

/*

*/

const sketch = (s) => {
	let size, dt, snd;
	let p = {
		play: false,
		isInit: true,
		vol: 0,
		frameRate: 0,
	};
	s.setup = () => {
		u.initRoutine(s);
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
	};
	s.draw = () => {
		function getDt(_dt) {
			dt = {};
			dt.isTouch = s.touches.length != 0;
			const _tracks = p.isInit ?
				[...Array(3)].map(() => Array(50).fill(0)) :
				_dt.tracks;
			dt.tracks = _tracks.map((_track, index) =>
				s.touches.length > index ?
					[s.touches[index], ..._track.slice(0, -1)] :
					[0, ..._track.slice(0, -1)]);
			dt.snd = (() => {
				const snd = {};
				snd.pan = dt.isTouch ? s.map(s.mouseX, 0, size, -1, 1) :  size * 0.5;
				snd.vol = dt.isTouch ? s.map(s.mouseY, 0, size, 0, 1) : 0;
				return snd;
			})();
			return dt;
		}
		dt = getDt(dt);
		function routine() {
			s.background(255);
			s.noStroke();
			u.drawFrame(s, size);
			u.debug(s, p, dt.tracks[0], 3); // 4-length, 5-start, 6-refresh
			p.frameRate = s.isLooping() ? s.frameRate() : 0;
			if (p.isInit) { p.isInit = false };
		}
		routine();
		function drawTracks() {
			dt.tracks.forEach((track, trackIndex) => {
				s.beginShape();
				s.stroke(50 * (trackIndex +1));
				track.forEach((point) => {
					if (point === 0) return ;
					s.vertex(point.x, point.y);
				});
				s.endShape();
				});
		}
		drawTracks();
		function playSnd() {
			snd.osc.pan(dt.snd.pan);
			snd.osc.amp(dt.snd.vol);
		}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};
new p5(sketch);
