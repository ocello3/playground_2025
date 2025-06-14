import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";

/*
音が出るか確認
末尾配列のx座標を使ってない
*/

const sketch = (s) => {
	let size, dt, snd;
	let p = {
		play: false,
		isInit: true,
		vol: 0,
		frameRate: 0,
		fingers: 3,
		colors: [s.color(123, 108, 103), s.color(213, 85, 33), s.color(138, 37, 27)],
	};
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		snd = (()=> {
			const snd = {};
			snd.oscs = [...Array(p.fingers)].map(() => {
				const osc = new p5.Oscillator('sine');
				osc.amp(0);
				return osc;
			});
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
			const _tracks = p.isInit ?
				[...Array(p.fingers)].map(() => Array(50).fill(0)) :
				_dt.tracks;
			dt.tracks = _tracks.map((_track, index) =>
				(s.touches.length > index && s.frameCount % 3 === 0) ?
					[s.touches[index], ..._track.slice(0, -1)] :
					[0, ..._track.slice(0, -1)]);
			dt.snds = dt.tracks.map((track) => {
				const snd = {};
				snd.pan = (track[0] === 0) ? 0 : s.map(track[0].x, 0, size, -1, 1);
				snd.vol = (track[0] === 0) ? 0 : s.map(track[0].y, 0, size, 0, 0.8);
				snd.freq = (track.at(-1) === 0) ? 0 : s.map(track.at(-1).y, 0, size, 50, 1000);
				return snd;
			});
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
			// track line
			dt.tracks.forEach((track, trackIndex) => {
				s.push();
				s.beginShape();
				s.noStroke();
				s.fill(p.colors[trackIndex]);
				track.forEach((point) => {
					if (point === 0) return ;
					s.vertex(point.x, point.y);
				});
				s.endShape();
				s.pop();
			});
			// tie head and tail
			s.push();
			s.beginShape();
			s.fill(240, 220);
			dt.tracks.forEach((track) => {
				if (track[0] != 0) s.vertex(track.at(-1).x, track[0].y);
				if (track.at(-1) != 0) s.vertex(track.at(-1).x, track.at(-1).y);
			});
			s.endShape(s.CLOSE);
			s.pop();
		}
		drawTracks();
		function playSnd() {
			snd.oscs.forEach((osc,index) => {
				osc.pan(dt.snds[index].pan);
				osc.amp(dt.snds[index].vol);
				osc.freq(dt.snds[index].freq);
			})
		}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};
new p5(sketch);
