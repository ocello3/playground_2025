const setParams = (params) => {
	const ball = {};
	ball.num = 16;
	ball.radius = params.size / 4;
	ball.interval = 60;
	ball.refreshInterval = ball.interval * 4;
	return ball;
}

const setBall = (index) => (s, params, centerPos) => {
	const ball = {};
	ball.easingF = Math.random();
	ball.centerPos = centerPos;
	const setPos = () => {
		const intervalAngle = Math.PI*2/params.ball.num;
		const angle = intervalAngle * index;
		const x = centerPos.x + params.ball.radius * Math.cos(angle);
		const y = centerPos.y + params.ball.radius * Math.sin(angle);
		return s.createVector(x, y);
	}
	ball.pos = setPos();
	ball.targetPos = ball.pos;
	return ball;
}

export const setBalls = (s, params) => {
	params.ball = setParams(params);
	const balls = {};
	balls.isUpdate = false;
	balls.centerPos = s.createVector(params.size/2, params.size/2);
	balls.ballArr = Array.from(Array(params.ball.num), (_, index) => setBall(index)(s, params, balls.centerPos));
	return balls;
}

const updateBall = (preBall) => (s, params, isUpdate, centerPos) => {
	const newBall = { ...preBall };
	newBall.centerPos = centerPos;
	const updateTargetPos = () => {
		const diff = p5.Vector.sub(newBall.centerPos, preBall.centerPos);
		return p5.Vector.add(preBall.pos, diff);
	}
	if (isUpdate) {
		newBall.targetPos = updateTargetPos();
		newBall.easingF = Math.random();
	}
	const updatePos = () => {
		const diff = p5.Vector.sub(newBall.targetPos, preBall.pos);
		const update = p5.Vector.mult(diff, newBall.easingF);
		return p5.Vector.add(preBall.pos, update);
	}
	newBall.pos = updatePos();
	return newBall;
}

export const updateBalls = (preBalls, s, params) => {
	const newBalls = { ...preBalls };
	newBalls.isRefresh = (s.frameCount % params.ball.refreshInterval === 0);
	newBalls.isUpdate = (s.frameCount % params.ball.interval === 0);
	if (newBalls.isUpdate) {
		newBalls.centerPos = s.createVector(Math.random()*params.size, Math.random()*params.size);
	}
	newBalls.ballArr =  preBalls.ballArr.map((preBall) => updateBall(preBall)(s, params, newBalls.isUpdate, newBalls.centerPos));
	return newBalls;
}

export const drawBall = (s, balls, params) => {
	const drawBackground = () => {
		s.push();
		s.fill(255, (balls.isRefresh)?255:5);
		s.rect(0, 0, params.size);
		s.pop();
	}
	drawBackground();
	const drawCircle = () => {
		const ballArr = balls.ballArr;
		s.push();
		s.noFill();
		s.stroke(0);
		s.beginShape();
		s.curveVertex(ballArr.slice(-1)[0].pos.x, ballArr.slice(-1)[0].pos.y);
		ballArr.forEach(ball => {
			s.curveVertex(ball.pos.x, ball.pos.y);
		});
		s.curveVertex(ballArr[0].pos.x, ballArr[0].pos.y);
		s.curveVertex(ballArr[1].pos.x, ballArr[1].pos.y);
		s.endShape();
		s.pop();
	}
	if (!balls.isRefresh) drawCircle();
	return false;
}
