export const getParams = () => {
	const p = {
		play: false,
		isInit: true,
		vol: 0,
		frameRate: 0,
		// sketch
		fingers: 3,
		colors: [
			[0, 0, 0],
			[101, 104, 237],
			[6, 7, 191]
		],
		dots: 30, 
		time_vel: 0.01,
		time_gap: 0.001,
		center_x: [0.5, 0.5, 0.5],
		center_y: [0.5, 0.5, 0.3],
		frame_x: [0.3, 0.6, 0.5],
		frame_y: [1, 0.5, 0.4],
		lis_a: 3,
		lis_b: 2,
		lis_delta: 0.5,
		lis_scaleX: 0.5,
		lis_scaleY: 0.5,
		// sound
		dist_thres: 0.25,
		amp_max: 0.5,
		bases: [800, 1400, 2000],
	};
	return p;
}