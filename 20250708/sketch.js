import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";

/*
todo:
- タッチの座標を自動化する。文字の外枠とか
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
			fingers: 3,
			colors: [
				[123, 108, 103],
				[213, 85, 33],
				[138, 37, 27]
			],
			osc_amp: 0.4,
			mod_amp: 0.3,
			mod_freq: 1,
			lis_a: 3,
			lis_b: 2,
			lis_delta: 0.5,
			lis_scaleX: 0.5,
			lis_scaleY: 0.5,
		};
		snd = (() => {
			const snd = {};
			snd.oscs = {
				head: [...Array(p.fingers)].map(() => {
					const osc = new p5.Oscillator('sine');
					osc.amp(0);
					return osc;
				}),
				tail: [...Array(p.fingers)].map(() => {
					const osc = new p5.Oscillator('square');
					osc.amp(0);
					return osc;
				}),
			};
			snd.mod = new p5.Oscillator('sine');
			snd.mod.disconnect();
			snd.mod.amp(0);
			snd.mod.freq(1);
			snd.osc = new p5.Oscillator('sine');
			snd.osc.amp(snd.mod.scale(-1, 1, 0, p.osc_amp));
			snd.osc.freq(440);
			return snd;
		})();
		// console.log(snd.oscs.head[0]);
		// s.frameRate(10);
		function activate() {
			snd.oscs.head.forEach(osc => { osc.start() });
			snd.oscs.tail.forEach(osc => { osc.start() });
			snd.mod.start();
			snd.osc.start();
		}
		const f = u.createPane(s, p, activate);
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
		f2.addBinding(p, 'mod_amp', {
			min: 0,
			max: 1,
		});
		f2.addBinding(p, 'mod_freq', {
			min: 0.1,
			max: 0.8,
		});
		f2.addBinding(p, 'osc_amp', {
			min: 0,
			max: 1,
		});
	};
	s.draw = () => {
		function getDt(_dt) {
			dt = {};
			dt.times = p.isInit ?
				[...Array(p.fingers)].map(() => 0) :
				_dt.times.map((time, index) => time + 0.005 + 0.001 * index);
			dt.heads = dt.times.map((t) => {
				/* Lissajous curve
				x(t) = A * sin(a * t + δ)
				y(t) = B * sin(b * t)
				*/
				const x = size * p.lis_scaleX * s.sin(p.lis_a * t * p.lis_delta * s.PI);
				const y = size * p.lis_scaleY *  s.sin(p.lis_b * t);
				return s.createVector(size * 0.5 + x, size * 0.5 + y);
			});
			const _tracks = p.isInit ? [...Array(p.fingers)].map(() => Array(50).fill(0)) :
				_dt.tracks;
			dt.tracks = _tracks.map((_track, index) =>
				(s.frameCount % 3 === 0) ? [dt.heads[index], ..._track.slice(0, -1)] : [0, ..._track.slice(0, -1)]);
			dt.alpha = (() => {
				const vol = snd.mod.getAmp();
				return s.map(vol, 0, 1, 50, 255);
			})();
			dt.snds = dt.tracks.map((track, i) => {
				const getPan = (index, type) => {
					if (p.isInit) return 0;
					if (track.at(index) === 0) return _dt.snds[i][type].pan;
					return s.map(track.at(index).x, 0, size, -1, 1);
				}
				const getVol = (index, type) => {
					if (p.isInit) return 0;
					if (track.at(index) === 0) return _dt.snds[i][type].vol * 0.3; // reduc rate
					const center = s.createVector(size * 0.5, size * 0.5);
					const pos = s.createVector(track.at(index).x, track.at(index).y);
					const dist = p5.Vector.dist(center, pos);
					return s.map(dist, 0, size * 0.5, 0, 0.8);
				}
				const getFreq = (index, type) => {
					if (p.isInit) return 0;
					if (track.at(index) === 0) return _dt.snds[i][type].freq;
					return s.map(track.at(index).y, 0, size, 50, 1000);
				}
				const snd = {};
				snd.head = {
					pan: getPan(0, "head"),
					vol: getVol(0, "head"),
					freq: getFreq(0, "head"),
				};
				snd.tail = {
					pan: getPan(-1, "tail"),
					vol: getVol(-1, "tail"),
					freq: getFreq(-1, "tail"),
				};
				return snd;
			});
			dt.mod = (() => {
				// background oscillator snd
				const heads = dt.tracks.filter(track => track[0] !== 0);
				const num = heads.length;
				if (p.isInit === true) return { freq: 1, vol: 0 };
				if (num === 0) return _dt.mod;
				return {
					freq: s.map(dt.tracks[0][0].x, 0, size, 50, 1500),
					vol: s.map(dt.tracks[0][0].y, 0, size, 0.1, 0.6),
				}
			})();
			return dt;
		}
		dt = getDt(dt);

		function routine() {
			s.background(255, dt.alpha);
			s.noStroke();
			u.drawFrame(s, size);
			u.debug(s, p, dt.heads, 3); // 4-length, 5-start, 6-refresh
			p.frameRate = s.isLooping() ? s.frameRate() : 0;
		}
		routine();

		function drawTracks() {
			// track line
			dt.tracks.forEach((track, trackIndex) => {
				s.push();
				s.beginShape();
				s.noStroke();
				const c = p.colors[trackIndex];
				s.fill(c[0], c[1], c[2], dt.alpha);
				track.forEach((point) => {
					if (point === 0) return;
					s.vertex(point.x, point.y);
				});
				s.endShape();
				s.pop();
			});
			// tie head and tail
			s.push();
			s.beginShape();
			s.fill(50, 150);
			dt.tracks.forEach((track) => {
				if (track[0] != 0) s.vertex(track.at(-1).x, track[0].y);
				if (track.at(-1) != 0) s.vertex(track.at(-1).x, track.at(-1).y);
			});
			s.endShape(s.CLOSE);
			s.pop();
		}
		drawTracks();

		function playSnd() {
			snd.mod.amp(dt.mod.vol);
			snd.mod.freq(dt.mod.freq);
			snd.oscs.tail.forEach((osc, index) => {
				osc.pan(dt.snds[index].tail.pan);
				osc.amp(dt.snds[index].tail.vol, 0.1);
				osc.freq(dt.snds[index].tail.freq);
			})
			snd.oscs.head.forEach((osc, index) => {
				osc.pan(dt.snds[index].head.pan);
				osc.amp(dt.snds[index].head.vol, 0.1);
				osc.freq(dt.snds[index].head.freq);
			})
			snd.osc.amp(0.8);
		}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};
new p5(sketch);