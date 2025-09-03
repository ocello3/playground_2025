// util.js
import { Pane } from "../lib/tweakpane-4.0.3.min.js";

/**
 * initRoutine(s)
 * - create a minimal canvas, real size will be set by getSize()
 * - disable loop and mute audio until user starts playback
 */
export function initRoutine(s) {
	s.createCanvas(10, 10).parent("canvas");
	s.noLoop();
	s.outputVolume(0);
	document.addEventListener("gesturestart", (e) => e.preventDefault());
	document.addEventListener("gesturechange", (e) => e.preventDefault());
	document.addEventListener("gestureend", (e) => e.preventDefault());
}

/**
 * createPane(s, p, activate)
 * - creates a Tweakpane folder bound to p
 * - activate is called on the first play event
 */
export function createPane(s, p, activate = undefined) {
	const pane = new Pane({ container: document.getElementById("pane") });
	const f = pane.addFolder({ title: "pane" });

	f.addBinding(p, "play").on("change", (ev) => {
		if (ev.value) {
			s.userStartAudio();
			s.loop();
			p.vol = 0.8;
			s.outputVolume(p.vol, 0.1);
			pane.refresh();
			if (p.isInit) {
				if (activate) activate();
				p.isInit = false;
			}
		} else {
			p.vol = 0;
			s.outputVolume(p.vol, 0.1);
			s.noLoop();
			pane.refresh();
		}
	});

	f.addBinding(p, "vol", { min: 0, max: 1 }).on("change", (ev) =>
		s.outputVolume(ev.value)
	);

	f.addBinding(p, "frameRate", { readonly: true, interval: 500 });

	return f;
}

/* ----------------------
   Debug helpers
   ---------------------- */

const isIndividualData = (arg) =>
	typeof arg === "string" ||
	typeof arg === "number" ||
	typeof arg === "boolean" ||
	(typeof p5 !== "undefined" && arg instanceof p5.Vector);

const isNeedToDivideObject = (arg) =>
	typeof arg === "object" && arg !== null && !(typeof p5 !== "undefined" && arg instanceof p5.Vector);

const addDataToStringArray = (key, data, logList) => {
	if (Array.isArray(data)) {
		logList.push("[");
		data.forEach((element, index) => {
			if (typeof p5 !== "undefined" && element instanceof p5.Vector) {
				const v = `(${element.x.toFixed(2)}, ${element.y.toFixed(2)}, ${element.z.toFixed(2)})`;
				logList.push(index === data.length - 1 ? `${v}` : `${v},<br>`);
			} else {
				const e = typeof element === "number" ? element.toFixed(2) : element;
				logList.push(index === data.length - 1 ? `${e}` : `${e}, `);
			}
		});
		logList.push("]<br>");
	} else {
		if (typeof p5 !== "undefined" && data instanceof p5.Vector) {
			const v = `(${data.x.toFixed(2)}, ${data.y.toFixed(2)}, ${data.z.toFixed(2)})`;
			logList.push(`${key}: ${v}<br>`);
		} else {
			const d = typeof data === "number" ? data.toFixed(2) : data;
			logList.push(`${key}: ${d}<br>`);
		}
	}
};

const divideArrayToString = (arg, length, start, logList) => {
	const limitedStart = Math.max(0, Math.min(start, Math.max(0, arg.length - 1)));
	const limitedLength =
		length == null ?
		arg.length - limitedStart :
		Math.max(0, Math.min(length, arg.length - limitedStart));
	const part = arg.slice(limitedStart, limitedStart + limitedLength);

	if (part.length === 0) return logList;

	if (part[0] == null || isIndividualData(part[0])) {
		addDataToStringArray(" - ", part, logList);
	} else {
		part.forEach((innerObj, i) => {
			logList.push(`- index ${i + limitedStart}<br>`);
			if (typeof p5 !== "undefined" && innerObj instanceof p5.Vector) {
				addDataToStringArray(" - ", innerObj, logList);
			} else {
				divideObjectToString(innerObj, length, start, logList);
			}
		});
	}
	return logList;
};

const divideObjectToString = (arg, length, start, logList) => {
	if (!arg || typeof arg !== "object") return logList;
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

export function debug(s, p, arg, displayArrayLength = null, startPosition = 0, refreshInterval = 20) {
	const logList = [];
	if (Array.isArray(arg)) {
		divideArrayToString(arg, displayArrayLength, startPosition, logList);
	} else if (isIndividualData(arg)) {
		addDataToStringArray(" - ", arg, logList);
	} else if (arg && typeof arg === "object") {
		divideObjectToString(arg, displayArrayLength, startPosition, logList);
	} else {
		logList.push(String(arg));
	}

	if (p.isInit === true || s.frameCount % refreshInterval === 0) {
		const el = document.getElementById("debug");
		if (el) el.innerHTML = "".concat(...logList);
	}
}

/* ----------------------
   Size helpers
   ---------------------- */

export function getSize(s) {
	const div = document.getElementById("canvas");
	const width = div?.clientWidth ?? window.innerWidth;
	const height = div?.clientHeight ?? window.innerHeight;
	const size = Math.min(width, height);
	s.resizeCanvas(size, size);
	return size;
}

export function drawFrame(s, size) {
	s.push();
	s.noFill();
	s.strokeWeight(1);
	s.stroke(0);
	s.rect(0, 0, size, size);
	s.pop();
}

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

/* ----------------------
   Proxy safe functions
   ---------------------- */

function safeStringify(obj, maxLen = 200) {
	try {
		let str = JSON.stringify(obj);
		if (str.length > maxLen) str = str.slice(0, maxLen) + "...(truncated)";
		return str;
	} catch {
		return "[unserializable]";
	}
}

function deepSafe(obj, debugMode) {
	if (!debugMode || typeof obj !== "object" || obj === null) return obj;

	const handler = {
		get(target, prop, receiver) {
			if (Array.isArray(target) && typeof prop === "string") {
				const idx = Number(prop);
				if (!Number.isNaN(idx)) {
					if (idx < 0 || idx >= target.length) {
						throw new Error(
							`Error | array out of bounds: index=${idx}, length=${target.length}\n` +
							`Target array: ${safeStringify(target)}`
						);
					}
				}
			}
			if (!(prop in target)) {
				throw new Error(
					`Error | property "${prop.toString()}" does not exist\n` +
					`Target object: ${safeStringify(target)}`
				);
			}

			const value = Reflect.get(target, prop, receiver);

			if (typeof p5 !== "undefined" && value instanceof p5.Vector) return value;

			return deepSafe(value, true);
		},

		set(target, prop, value, receiver) {
			if (Array.isArray(target) && typeof prop === "string") {
				const idx = Number(prop);
				if (!Number.isNaN(idx)) {
					if (idx < 0 || idx >= target.length) {
						throw new Error(
							`Error | array write out of bounds: index=${idx}, length=${target.length}\n` +
							`Target array: ${safeStringify(target)}`
						);
					}
				}
			}
			if (!(prop in target)) {
				throw new Error(
					`Error | property "${prop.toString()}" does not exist (set)\n` +
					`Target object: ${safeStringify(target)}`
				);
			}
			return Reflect.set(target, prop, value, receiver);
		}
	};

	return new Proxy(obj, handler);
}

/**
 * safe(obj, params)
 * - reads params.debugMode and returns either raw obj or Proxy-wrapped object
 */
export function safe(obj, params) {
	return deepSafe(obj, !!params?.debugMode);
}
