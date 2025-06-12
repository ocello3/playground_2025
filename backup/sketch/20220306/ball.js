export const setParamsForBall = (params) => {
	const ball = {};
	ball.num = 16;
	ball.radius = params.size / 3;
	ball.interval = 60;
	params.ball = ball;
}

const setBall = (index) => (s, params, centerPos) => {
	const ball = {};
	ball.centerPos = centerPos;
	const setPos = () => {
		const intervalAngle = Math.PI*2/params.ball.num;
		const angle = intervalAngle * index;
		const x = centerPos.x + params.ball.radius * Math.cos(angle);
		const y = centerPos.y + params.ball.radius * Math.sin(angle);
		return s.createVector(x, y);
	}
	ball.pos = setPos();
	return ball;
}

export const setBalls = (s, params) => {
	const balls = {};
	balls.isUpdate = false;
	balls.centerPos = s.createVector(params.size/2, params.size/2);
	const blankArray = Array(params.ball.num);
	balls.ballArr = Array.from(blankArray, (_, index) => setBall(index)(s, params, balls.centerPos));
	return balls;
}

const updateBall = (preBall) => (s, params, centerPos) => {
	const newBall = { ...preBall };
	newBall.centerPos = centerPos;
	const updatePos = () => {
		const diff = p5.Vector.sub(newBall.centerPos, preBall.centerPos);
		return p5.Vector.add(preBall.pos, diff);
	}
	newBall.pos = updatePos();
	return newBall;
}

export const updateBalls = (preBalls, s, params) => {
	const newBalls = { ...preBalls };
	newBalls.isUpdate = (s.frameCount % params.ball.interval === 0);
	newBalls.centerPos = s.createVector(Math.random()*params.size, Math.random()*params.size);
	const centerPos = (newBalls.isUpdate)? newBalls.centerPos: preBalls.centerPos;
	newBalls.ballArr =  preBalls.ballArr.map((preBall) => updateBall(preBall)(s, params, centerPos));
	return newBalls;
}

export const drawBall = (s, balls) => {
	s.push();
	s.noFill();
	s.stroke(0);
	s.beginShape();
	s.curveVertex(balls.slice(-1)[0].pos.x, balls.slice(-1)[0].pos.y);
	balls.forEach(ball => {
		s.curveVertex(ball.pos.x, ball.pos.y);
	});
	s.curveVertex(balls[0].pos.x, balls[0].pos.y);
	s.curveVertex(balls[1].pos.x, balls[1].pos.y);
	s.endShape();
	s.pop();
	return false;
}
