import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";
import { getParams } from "./params.js";

/*
todo:
- リサージュ曲線の固定したパラメータ（time含む）をtweakpaneに出す
- 音がずっとなっていてうるさいので、たまに音が鳴る程度に調整する
*/

const sketch = (s) => {
	let p, size, dt, snd;
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = getParams();
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
			// snd.osc.amp(snd.mod.scale(-1, 1, 0, p.osc_amp));
			snd.osc.amp(0); // remove to play
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
			dt.times = p.isInit ? [...Array(p.fingers)].map(() => 0) :
				_dt.times.map((time, index) => time + p.time_vel + p.time_gap * index);
			dt.heads = dt.times.map((t, i) => {
				/* Lissajous curve
				x(t) = A * sin(a * t + δ)
				y(t) = B * sin(b * t)
				*/
				const center = s.createVector(size * p.center_x[i], size * p.center_y[i]);
				const frame = s.createVector(size * p.frame_x[i], size * p.frame_y[i]);
				const rate = (() => {
					const x = p.lis_scaleX * s.sin(p.lis_a * t * p.lis_delta * s.PI);
					const y = p.lis_scaleY * s.sin(p.lis_b * t);
					return s.createVector(x, y);
				})();
				const diff = p5.Vector.mult(frame, rate);
				return p5.Vector.add(center, diff);
			});
			dt.proximities = dt.heads.map((head, i, heads) => {
				const indexes = (() => {
					if (i === 0) return [1, 2];
					if (i === 1) return [0, 2];
					if (i === 2) return [0, 1];
				})();
				const d1 = p5.Vector.dist(head, heads[indexes[0]]);
				const d2 = p5.Vector.dist(head, heads[indexes[1]]);
				const dist = d1 < d2 ? d1 : d2;
				const thres = size * p.dist_thres;
				if (dist > thres) return 0;
				return s.map(dist, 0, thres, 1, 0);
			});
			const _tracks = p.isInit ? [...Array(p.fingers)].map(() => Array(p.dots).fill(0)) :
				_dt.tracks;
			dt.tracks = _tracks.map((_track, index) =>
				(s.frameCount % (1) === 0) ? [dt.heads[index], ..._track.slice(0, -1)] : [0, ..._track.slice(0, -1)]);
			dt.alphas = dt.proximities.map(proximity =>
				s.map(proximity, 0, 1, 0, 255));
			dt.snds = dt.tracks.map((track, i) => {
				const getPan = (index, type) => {
					if (p.isInit) return 0;
					if (track.at(index) === 0) return _dt.snds[i][type].pan;
					return s.map(track.at(index).x, 0, size, -1, 1);
				}
				const getVol = (index, type) => {
					if (p.isInit) return 0;
					// calc by the dist with other heads for max vol
					const max = dt.proximities[i] * 0.5;
					// calc by the position for base vol
					// if (track.at(index) === 0) return _dt.snds[i][type].vol * 0.3; // reduc rate
					const center = s.createVector(size * 0.5, size * 0.5);
					const pos = s.createVector(track.at(index).x, track.at(index).y);
					const dist = p5.Vector.dist(center, pos);
					return s.map(dist, 0, size, 0, max);
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
			u.debug(s, p, dt.snds, 3); // 4-length, 5-start, 6-refresh
			p.frameRate = s.isLooping() ? s.frameRate() : 0;
		}
		routine();

		function drawTracks() {
			// track line
			dt.tracks.forEach((track, trackIndex) => {
				const c = p.colors[trackIndex];
				const a = dt.alphas[trackIndex];
				const a_stroke = a === 0 ? 255 : a;
				s.push();
				s.strokeWeight(size * 0.0001)
				s.stroke(c[0], c[1], c[2], a_stroke);
				s.fill(c[0], c[1], c[2], a);
				s.beginShape();
				track.forEach((point) => {
					if (point === 0) return;
					s.curveVertex(point.x, point.y);
				});
				s.endShape();
				s.pop();
			});
			// tie head and tail
			/*
			s.push();
			s.beginShape();
			s.fill(50, 150);
			dt.tracks.forEach((track) => {
				if (track[0] != 0) s.vertex(track.at(-1).x, track[0].y);
				if (track.at(-1) != 0) s.vertex(track.at(-1).x, track.at(-1).y);
			});
			s.endShape(s.CLOSE);
			s.pop();
			*/
		}
		drawTracks();

		function playSnd() {
			/*
			snd.mod.amp(dt.mod.vol);
			snd.mod.freq(dt.mod.freq);
			*/
			snd.oscs.tail.forEach((osc, index) => {
				osc.pan(dt.snds[index].tail.pan);
				osc.amp(dt.snds[index].tail.vol, 0.01);
				osc.freq(dt.snds[index].tail.freq);
			})
			snd.oscs.head.forEach((osc, index) => {
				osc.pan(dt.snds[index].head.pan);
				osc.amp(dt.snds[index].head.vol, 0.01);
				osc.freq(dt.snds[index].head.freq);
			})
			// snd.osc.amp(0.2);
		}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};
new p5(sketch);