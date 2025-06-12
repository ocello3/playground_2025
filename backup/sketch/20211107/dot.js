import { s } from './sketch.js';
import { setParams } from './params.js';

const setXYindex = (index, params) => {
	const xIndex = index % params.num;
	const yIndex = Math.floor(index / params.num);
	return s.createVector(xIndex, yIndex);
}

const setPos = (params, xyIndex) => {
	const x = params.size / (params.num) * (xyIndex.x);
	const y = params.size / (params.num) * (xyIndex.y);
	return s.createVector(x, y);
}

const setColor = (pos, img) => {
	const color = img.get(pos.x, pos.y);
	return s.color(s.red(color), s.green(color), s.blue(color), 100)}

export const setDot = (index) => (params, img) => {
	const initDot = {};
	initDot.xyIndex = setXYindex(index, params);
	initDot.size = params.size / (params.num);
	initDot.pos = setPos(params, initDot.xyIndex);
	initDot.noiseZ = 0;
	initDot.noise = s.noise(initDot.pos.x, initDot.pos.y, initDot.noiseZ);
	initDot.color = setColor(initDot.pos, img);
	return initDot;
}

const updateNoiseZ = (params) => {
	return params.noiseZ = (params.noiseZ_max - params.noiseZ_min) * (Math.sin(params.frameCount * params.speedRate)) - params.noiseZ_min;
}

const updateNoise = (pos, noiseZ) => {
	return s.noise(pos.x, pos.y, noiseZ);
}

export const updateDot = (preDot) => (params) => {
	const newDot =  { ...preDot };
	newDot.noiseZ = updateNoiseZ(params);
	newDot.noise = updateNoise(newDot.pos, newDot.noiseZ);
	return newDot;
}
