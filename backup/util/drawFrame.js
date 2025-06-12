export const drawFrame = (s, params) => {
	s.push();
	s.noFill();
	s.stroke(0);
	s.rect(0, 0, params.size, params.size);
	s.pop();
	return false;
}