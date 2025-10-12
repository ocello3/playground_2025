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
		sentense:"環境音に合わせてタイプされる。タイプのトリガーは音量とする。トリガーとなる音で文字サイズを変える。持続する音量と共に文字が横に伸びる。文字が画面の横幅いっぱいになったら改行する。文字行が画面の縦幅いっぱいになったら改ページする",
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