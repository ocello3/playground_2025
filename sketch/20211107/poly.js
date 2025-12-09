import { s } from './sketch.js';
import { updateDot } from './dot.js';

export const setPoly = (params, grid) => {
	const initPoly = {};
	initPoly.centerPos = s.createVector(params.size/2, params.size/2);
	initPoly.dists = Array.from(Array(grid.length), dot => 0);
	return initPoly;
}

export const testSetPoly = (poly) => {
	console.assert(poly.centerPos.x > 0, `centerPos.x: ${poly.centerPos}`);
	poly.dists.forEach((dist, index) => {
		console.assert(dist == 0, `dist: ${dist}, index: ${index}`);
	});
}

const updateDists = (centerPos, grid) => {
	return grid.map(dot => dot.pos.dist(centerPos));
}

const updatePoss = (updatedDists, grid, params) => {
	const poss = [];
	updatedDists.forEach((dist, index) => {
		const flag_1 = dist < params.dist_max;
		const flag_2 = grid[index].noise < 0.4;
		if (flag_1 && flag_2) {
			const pos = grid[index].pos;
			poss.push(s.createVector(pos.x, pos.y, index));
		}
	});
	return poss;
}

export const updatePoly = (prePoly) => (grid, params) => {
	const newPoly = { ...prePoly };
	newPoly.centerPos = s.createVector(s.mouseX, s.mouseY);
	newPoly.dists = updateDists(newPoly.centerPos, grid);
	newPoly.poss = updatePoss(newPoly.dists, grid, params)
	return newPoly;
}

export const testUpdatedPoly = (params, grid) => {
	const updatedDists = updateDists(initPoly.centerPos, newGrid);
	updatedDists.forEach((dist, index) => {
		console.assert(dist >= 0, `dist: ${dist}, index: ${index}`);
	});
}
