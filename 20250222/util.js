import { Pane } from "../lib/tweakpane-4.0.3.min.js";
import * as e from "./effect.js";

// create pane by tweakpane and return folder as 'f'
export const createPane = (s, p, snd) => {
	const pane = new Pane({
		container: document.getElementById("pane"),
	});
	const f = pane.addFolder({
		title: "pane",
	});
	f.addBinding(p, "play").on("change", (isChecked) => {
		if (isChecked.value) {
			s.userStartAudio();
			s.loop();
			p.vol = 0.8;
			s.outputVolume(p.vol, 0.1);
			pane.refresh();
			if (p.isInit) {
				e.startOsc(s, p, snd);
				p.isInit = false;
			}
			return;
		} else {
			p.vol = 0;
			s.outputVolume(p.vol, 0.1);
			s.noLoop();
			pane.refresh();
			return;
		}
	});
	f.addBinding(p, "vol", {
		min: 0,
		max: 1,
	}).on("change", (vol) => s.outputVolume(vol.value));
	f.addBinding(p, "frameRate", {
		readonly: true,
		interval: 500,
	});
	return f;
};

// debug
const isIndividualData = (arg) =>
	typeof arg === "string" ||
	typeof arg === "number" ||
	typeof arg === "boolean" ||
	arg instanceof p5.Vector;

const isNeedToDivideObject = (arg) =>
	typeof arg === "object" && !(arg instanceof p5.Vector);

// for any array argument
const divideArrayToString = (arg, length, start, logList) => {
	// extract a part of array
	const limitedStart = start < arg.length ? start : arg.length - 1;
	const calcLimitedLength = () => {
		if (length === null) return arg.length;
		const lastId = limitedStart + length;
		const isOver = lastId > arg.length;
		return isOver ? arg.length - limitedStart : length;
	};
	const limitedLength = calcLimitedLength();
	const limitedObjArray = arg.slice(limitedStart, limitedStart + limitedLength);
	if (isIndividualData(limitedObjArray[0])) {
		// for indivisual data type, add to array
		addDataToStringArray(" - ", limitedObjArray, logList);
	} else {
		// for object, divide and add to array
		limitedObjArray.forEach((innerObj, index) => {
			logList.push(`- index ${index + limitedStart}<br>`);
			if (innerObj instanceof p5.Vector) {
				addDataToStringArray(" - ", innerObj, logList);
			} else {
				divideObjectToString(innerObj, length, start, logList);
			}
		});
	}
	return logList;
};

// for non-array argument without individual data type
const divideObjectToString = (arg, length, start, logList) => {
	for (const key in arg) {
		if (Array.isArray(arg[key])) {
			logList.push(`-- ${key}:<br>`);
			divideArrayToString(arg[key], length, start, logList);
		} else if (isIndividualData(arg[key])) {
			addDataToStringArray(key, arg[key], logList);
		} else if (isNeedToDivideObject(arg[key])) {
			divideObjectToString(arg[key], length, start, logList);
		}
	}
	return logList;
};

// add display-data to array
const addDataToStringArray = (key, data, logList) => {
	if (Array.isArray(data)) {
		// for p5.Vector: add to new line
		if (data[0] instanceof p5.Vector) {
			logList.push(`[`);
			data.forEach((element, index) => {
				if (element instanceof p5.Vector) {
					// p5.Vector の場合は成分ごとにフォーマット
					const formattedVector = `(${element.x.toFixed(2)}, ${element.y.toFixed(2)}, ${element.z.toFixed(2)})`;
					if (index === data.length - 1) {
						logList.push(`${formattedVector}`);
					} else {
						logList.push(`${formattedVector},<br>`);
					}
				} else {
					// その他のデータ型
					const formattedElement = typeof element === "number" ? element.toFixed(2) : element;
					if (index === data.length - 1) {
						logList.push(`${formattedElement}`);
					} else {
						logList.push(`${formattedElement},<br>`);
					}
				}
			});
			logList.push(`]<br>`);
		} else {
			// for other data (string, number, boolean): add to same line
			logList.push(`[`);
			data.forEach((element, index) => {
				const formattedElement = typeof element === "number" ? element.toFixed(2) : element;
				if (index === data.length - 1) {
					logList.push(`${formattedElement}`);
				} else {
					logList.push(`${formattedElement}, `);
				}
			});
			logList.push(`]<br>`);
		}
	} else {
		// if NOT array
		if (data instanceof p5.Vector) {
			// p5.Vector の場合
			const formattedVector = `(${data.x.toFixed(2)}, ${data.y.toFixed(2)}, ${data.z.toFixed(2)})`;
			logList.push(`${key}: ${formattedVector}<br>`);
		} else {
			// その他のデータ型
			const formattedData = typeof data === "number" ? data.toFixed(2) : data;
			logList.push(`${key}: ${formattedData}<br>`);
		}
	}
};

/**
 * @param {p5} s
 * @param {*} arg
 * @param {*} displayArrayLength
 * @param {*} startPosition
 */
export const debug = (s, p, arg, displayArrayLength = null, startPosition = 0, refreshInterval = 20) => {
	// header
	const title = ``;
	// data
	const logList = [];
	if (Array.isArray(arg)) {
		divideArrayToString(arg, displayArrayLength, startPosition, logList);
	} else if (isIndividualData(arg)) {
		addDataToStringArray(" - ", arg, logList);
	} else {
		divideObjectToString(arg, displayArrayLength, startPosition, logList);
	}
	if (p.isInit === true || s.frameCount % refreshInterval === 0) document.getElementById("debug").innerHTML = title.concat(...logList);
};

/**
 * get window size and resize
 * @param {p5} p5 object
 */
export const getSize = (s) => {
	const div = document.getElementById("canvas");
	const width = div.clientWidth;
	const height = div.clientHeight;
	const size = width > height ? height : width;
	s.resizeCanvas(size, size);
	return size;
};

/**
 * draw frame
 * @param {number} window width
 * @param {number} window height
 */
export const drawFrame = (s, size) => {
	s.push();
	s.noFill();
	s.strokeWeight(1);
	s.stroke(0);
	s.rect(0, 0, size, size);
	s.pop();
};

/**
 * surround argument function by push() and pop() for drawing
 * @param {*} func
 * @param {*} pg
 */
export function pp(s, func, pg = undefined) {
	if (pg === undefined) {
		s.push();
		func();
		s.pop();
	} else {
		pg.push();
		func();
		pg.pop();
	}
}
