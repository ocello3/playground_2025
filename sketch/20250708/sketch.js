import "../../lib/p5.min.js";
import "../../lib/p5.sound.min.js";
import * as u from "./util.js";
import { getParams } from "./params.js";

const sketch = (s) => {
	let p, size, dt, snd;
	s.setup = () => {
		u.initRoutine(s);
		size = u.getSize(s);
		p = getParams();
		snd = (() => {
			const snd = {};
			snd.oscs = {
				head: [...Array(3)].map(() => {
					const osc = new p5.Oscillator('sine');
					osc.amp(0);
					return osc;
				}),
				tail: [...Array(3)].map(() => {
					const osc = new p5.Oscillator('square');
					osc.amp(0);
					return osc;
				}),
			};
			return snd;
		})();
		// s.frameRate(10);
		function activate() {
			snd.oscs.head.forEach(osc => { osc.start() });
			snd.oscs.tail.forEach(osc => { osc.start() });
		}
		const f = u.createPane(s, p, activate);
		const f1 = f.addFolder({ title: "sketch" });
		const f2 = f.addFolder({ title: "sound" });
		f1.addBinding(p, 'lis_a', {
			min: 1,
			max: 10,
		});
		f1.addBinding(p, 'lis_b', {
			min: 1,
			max: 10,
		});
		f1.addBinding(p, 'lis_delta', {
			min: 0.1,
			max: 1.0,
		});
		f1.addBinding(p, 'dist_thres', {
			min: 0.01,
			max: 0.5,
		});
	};
	s.draw = () => {
		function getDt(_dt) {
			dt = {};
			dt.times = p.isInit ? [...Array(3)].map(() => 0) :
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
			const _tracks = p.isInit ? [...Array(3)].map(() => Array(p.dots).fill(0)) :
				_dt.tracks;
			dt.tracks = _tracks.map((_track, index) => [dt.heads[index], ..._track.slice(0, -1)]);
			dt.alphas = dt.proximities.map(proximity =>
				s.map(proximity, 0, 1, 0, 255));
			dt.snds = dt.tracks.map((track, t_i) => {
				const getPan = (p_i, type) => {
					if (p.isInit) return 0;
					const point = track.at(p_i);
					if (!point || point === 0) {
						return _dt?.snds?.[t_i]?.[type]?.pan ?? 0;
					}
					return s.map(point.x, 0, size, -1, 1);
				};
				const getVol = (p_i, type) => {
					if (p.isInit) return 0;
					const point = track.at(p_i);
					if (!point || point === 0) {
						return _dt?.snds?.[t_i]?.[type]?.vol ?? 0;
					}
					const max = dt.proximities[t_i] * p.amp_max;
					const center = s.createVector(size * 0.5, size * 0.5);
					const dist = p5.Vector.dist(center, point);
					return s.map(dist, 0, size, 0, max);
				};
				const getFreq = (p_i, type) => {
					if (p.isInit) return 0;
					const point = track.at(p_i);
					if (!point || point === 0) {
						return _dt?.snds?.[t_i]?.[type]?.freq ?? 0;
					}
					const rate = s.map(point.y, 0, size, 0.01, 1);
					return p.bases[t_i] * rate;
				};
				return {
					head: {
						pan: getPan(0, "head"),
						vol: getVol(0, "head"),
						freq: getFreq(0, "head"),
					},
					tail: {
						pan: getPan(-1, "tail"),
						vol: getVol(-1, "tail"),
						freq: getFreq(-1, "tail"),
					},
				};
			});
			return dt;
		}
		dt = getDt(dt);

		function routine() {
			s.background(242, 242, 242);
			s.noStroke();
			// u.drawFrame(s, size);
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
		}
		drawTracks();

		function playSnd() {
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
		}
		playSnd();
	};
	s.windowResized = () => {
		size = u.getSize(s);
	};
};
new p5(sketch);