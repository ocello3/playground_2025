// params.js
export const getParams = () => {
	return {
		// defaults
		play: false,
		isInit: true,
		vol: 0,
		frameRate: 0,
		debugMode: true, // single point to toggle safety checks

		// sketch
		bins: 1024,
		labels: 10,
		minFreq: 100,
		maxFreq: 5000,
		isMoved: false, // slider trigger
		isDetect: false, // 
	};
};