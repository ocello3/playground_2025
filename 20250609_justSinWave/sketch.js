import "../lib/p5.min.js";
import "../lib/p5.sound.min.js";
import * as u from "./util.js";

/*
音が出るか確認
末尾配列のx座標を使ってない
手が離れた、かつ、配列から消える点で音を出して、先頭の点はタッチ位置を取得して連続的に音を出す
結んでいる線を濃くしてそれでも音を鳴らしたい
先頭の座標でシンプルに音を鳴らす
背景のsinの音量を揺らす。背景の色の揺らぎを合わせる
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
			colors: [s.color(123, 108, 103), s.color(213, 85, 33), s.color(138, 37, 27)],
		};
		snd = (()=> {
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
			snd.osc = new p5.Oscillator('sine');
			snd.osc.amp(0);
			snd.osc.freq(440);
			return snd;
		})();
		// console.log(snd.oscs.head[0]);
		// s.frameRate(10);
		function activate() {
			snd.oscs.head.forEach(osc => { osc.start() });
			snd.oscs.tail.forEach(osc => { osc.start() });
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
				snd.tail = {
					pan: getPan(-1, "tail"),
					vol: getVol(-1, "tail"),
					freq: getFreq(-1, "tail"),
				};
				return snd;
			});
			return dt;
		}
		dt = getDt(dt);
		function routine() {
			s.background(255);
			s.noStroke();
			u.drawFrame(s, size);
			u.debug(s, p, dt.snds, 3); // 4-length, 5-start, 6-refresh
			p.frameRate = s.isLooping() ? s.frameRate() : 0;
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
			snd.oscs.tail.forEach((osc,index) => { // forEach is not working?
				osc.pan(dt.snds[index].tail.pan);
				osc.amp(dt.snds[index].tail.vol, 0.1);
				osc.freq(dt.snds[index].tail.freq);
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
