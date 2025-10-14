// params.js
export const getParams = () => {
	return {
		// defaults
		play: false,
		isInit: true,
		vol: 0,
		frameRate: 0,
		debugMode: true, // single point to toggle safety checks

		// sketch / sound settings
		sentense:"環境音。",
		volThres: 0.8,
		charWidth: 0.1,
		fontSizeRate: 0.1,
		colors: [
			[255, 0, 0],
			[0, 180, 255],
			[50, 200, 100]
		]
	};
};