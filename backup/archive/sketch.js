let params;

const setParams = (params) => {
	// scroll setting for ios safari
	window.onscroll = function () {
		if (document.body.scrollHeight == window.innerHeight + window.pageYOffset) {
			window.focus();
		}
	}
	// calc params
	params.canvasDiv = document.getElementById('sketch');
	params.width = params.canvasDiv.clientWidth;
	params.height = params.canvasDiv.clientWidth*0.2;
	params.scrollTop = 0;
	params.scrollmax = 200;
	params.scrollOffsetRate = 1.2;
	// font info
	params.fontSize = 1;
	params.text = 'Sketch List';
	params.points = params.font.textToPoints(params.text, 0, 0, params.fontSize, { // x, y - coordinate
		sampleFactor: 5, // higher values yield more points
		simplifyThreshold: 0, // if set to a non-zero value, collinear points will be be removed from the polygon
	});
	params.bounds = params.font.textBounds(params.text, 0, 0, params.fontSize);
}

const thisPreload = s => {
	params = {
		font: s.loadFont('./font/HelveticaNeue-Regular.otf'),　
	}
}

const testSetup = () => {
}

const thisSetup = s => {
	setParams(params);
	s.createCanvas(params.width, params.height);
	testSetup();
}

const testDraw = () => {
	s.noLoop();
}

const thisDraw = s => {
	s.background(255);
	/* frame
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.width, params.height);
	s.pop(); */
	// update
	params.scrollTop = params.canvasDiv.scrollTop || document.body.scrollTop || window.pageYOffset;
	const multRate = (params.scrollmax - params.scrollTop) / params.scrollmax; // top: 1, bottom: 0
	
	// font
	if (multRate < params.scrollOffsetRate) {
		s.push();
		s.scale(1, 1 - multRate * params.scrollOffsetRate);
		s.fill(100, (1-multRate) * 255 * params.scrollOffsetRate);
		s.textSize(34);
		s.textFont(params.font);
		s.textAlign(s.LEFT, s.CENTER);
		s.text(params.text, 0, params.height/2);
		s.pop();
	}
	
	// draw font points
	s.push();
	s.scale(1, multRate);
	s.fill(255 - 255 * multRate);
	s.noStroke();
	s.beginShape();
	s.translate(-params.bounds.x * params.width / params.bounds.w, -params.bounds.y * params.height / params.bounds.h);
	for (let i = 0; i < params.points.length; i++) {
		let p = params.points[i];
		s.vertex(
			p.x * params.width / params.bounds.w +
			Math.sin(20 * p.y / params.bounds.h + s.millis() / 1000) * params.width / 30,
			p.y * params.height / params.bounds.h
		);
	}
	s.endShape(s.CLOSE);
	s.pop();
	// testDraw();
}

const sketch = s => {
	s.preload = () => thisPreload(s);
	s.setup = () => thisSetup(s);
	s.draw = () => thisDraw(s);
}
export const s = new p5(sketch, 'sketch');
