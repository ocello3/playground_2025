import { s } from './sketch.js';

const status = {
	touched: 'touched',
	holded: 'holded',
	released: 'released',
	unholded: 'unholded'
};

export const setScroll = () => {
	const scroll = {};
	scroll.isTouched = false;
	scroll.status = 'unholded';
	scroll.pos = s.createVector(0, 0);
	scroll.motionVelocity = s.createVector(0, 0); // speed
	scroll.inertiaVelocity = s.createVector(0, 0); // inertia velocity
	scroll.velocity = s.createVector(0, 0); // merge above two factor
	return scroll;
}

const updateStatus = (preIsTouched, newIsTouched) => {
	if (!preIsTouched && newIsTouched) return status.touched;
	if (preIsTouched && newIsTouched) return status.holded;
	if (preIsTouched && !newIsTouched) return status.released;
	if (!preIsTouched && !newIsTouched) return status.unholded;
	throw 'type error';
}

// s.touchedを直接使うとtestが書けないので引数とする。
const updatePos = (newStatus, prePos, params) => {
	if (newStatus === status.touched || newStatus === status.holded) return s.createVector(params.touchedXPos, params.touchedYPos);	
	if (newStatus === status.released || newStatus === status.unholded) return prePos;
	throw 'type error';
}

const updateMotionVelocity = (newStatus, prePos, newPos) => {
	if (newStatus === status.touched || newStatus === status.unholded) return s.createVector(0, 0);
	if (newStatus === status.holded || newStatus === status.released) return newPos.sub(prePos);
	throw 'type error';
}

const updateInertiaVelocity = (newStatus, newMotionVelocity, preInertiaVelocity, preVelocity, params) => {
	if (newStatus === status.touched) return preVelocity;
	if (newStatus === status.holded || newStatus === status.unholded) return preInertiaVelocity * (1 - params.touchedEasingFactor);
	if (newStatus === status.released) return newMotionVelocity;
	throw 'type error';
}

const updateVelocity = (newStatus, newMotionVelocity, newInertiaVelocity) => {
	if (newStatus === status.touched || newStatus === status.released || newStatus === status.unholded) return newInertiaVelocity;
	if (newStatus === status.holded) return newMotionVelocity + newInertiaVelocity;
	throw 'type error';
}

export const updateScroll = (preScroll, params) => {
	const newScroll = { ...preScroll };
	newScroll.isTouched = !(s.touches.length === 0);
	newScroll.status = updateStatus(preScroll.isTouched, newScroll.status);
	newScroll.pos = updatePos(newScroll.status, preScroll.pos, params);
	newScroll.motionVelocity = updateMotionVelocity(newScroll.status, preScroll.pos, newScroll.pos);
	newScroll.inertiaVelocity = updateInertiaVelocity(newScroll.status, newScroll.motionVelocity, preScroll.inertiaVelocity, preScroll.velocity, params);
	newScroll.velocity = updateVelocity(newScroll.status, newScroll.motionVelocity, newScroll.inertiaVelocity);
	return newScroll;
}
