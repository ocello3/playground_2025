// called on "play" checkbox once
export const startOsc = (s, p, snd) => {
	// white noise
	snd.filter = new p5.LowPass();
	snd.filter.freq(1500);
	snd.filter.disconnect();
	snd.filter.connect(snd.reverb);
	snd.noiseGen = new p5.Noise("white");
	snd.noiseGen.amp(0.1);
	snd.noiseGen.start();
	snd.noiseGen.disconnect();
	snd.noiseGen.connect(snd.filter);
	// drops
	snd.drop = new p5.Oscillator('sine');
	snd.drop.amp(0);
	snd.drop.start();
	// reverb
	snd.reverb = new p5.Reverb(); // reverb-time and decay
	snd.reverb.process(snd.noiseGen, 3, 2);
	snd.reverb.process(snd.drop, 3, 2);
};

export const playOsc = (s, p, snd, dt) => {
	dt.drops.forEach((drop) => {
		if(!p.isInit&& drop.status === 'init') {
			snd.drop.freq(s.random(600, 1200));
			// ぽちゃん、のポを入れたい
			snd.drop.amp(0.2, 0.02);
			snd.drop.amp(0, 0.1, 0.05);
			// panも設定したい
		}
	});
}

export const drawDrop = (s, dt) => {
	dt.drops.forEach((drop) => {
		s.push();
		s.fill(0);
		s.circle(drop.pos.x, drop.pos.y, 10);
		s.pop();
	});
}
