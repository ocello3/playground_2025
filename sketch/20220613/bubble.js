const init = (flooderObj, params, s, tab) => {
    const { num } = flooderObj;
    params.bubble = {
        ampCf: 0.8,
        phaseVel: 0.03,
        cycleRate: 0.005,
        intervalRate: 0.005,
        ampRate: 0.00015,
    }
    const _param = params.bubble;
    const _tab = tab.pages[1];
    _tab.addSeparator();
	_tab.addInput(_param, 'ampCf', { step: 0.1, min: 0.1, max:  1.0});
	_tab.addInput(_param, 'phaseVel', {step: 0.01, min: 0.01, max:  0.1});
	_tab.addInput(_param, 'cycleRate', { step: 0.001, min: 0.001, max:  0.01});
	_tab.addInput(_param, 'intervalRate', { step: 0.001, min: 0.001, max: 0.01 });
	_tab.addInput(_param, 'ampRate', { min: 0.00005, max: 0.001 });
    const bubbleObj = {};
    bubbleObj.bubbleLines = Array.from(Array(num), () => {
        const bubbleLine = {};
        bubbleLine.phase = 0;
        return bubbleLine;
    });
    return bubbleObj;
}

const update = (flooderObj, preObj, params, s) => {
    const newObj = { ...preObj };
    const { surfaceYPos, flooders } = flooderObj;
    const { ampCf, phaseVel, cycleRate, intervalRate, ampRate } = params.bubble;
    newObj.bubbleLines = preObj.bubbleLines.map((preBubbleLine, bubbleLineIndex) => {
        const newBubbleLine = { ...preBubbleLine };
        const flooder = flooders[bubbleLineIndex];
        newBubbleLine.cycle = params.size * flooder.m * cycleRate;
        newBubbleLine.interval = newBubbleLine.cycle * flooder.m * intervalRate;
        newBubbleLine.originPos = flooder.pos;
        newBubbleLine.num = Math.floor((newBubbleLine.originPos.y - surfaceYPos)/newBubbleLine.interval);
        newBubbleLine.amp = params.size * flooder.m * ampRate;
        newBubbleLine.phase = preBubbleLine.phase + phaseVel;
        newBubbleLine.isDraw = (newBubbleLine.num > 1);
        if (!newBubbleLine.isDraw) return newBubbleLine;
        const { originPos, num, cycle, interval, amp, phase } = newBubbleLine;
        newBubbleLine.bubbles = Array.from(Array(num), (_, bubbleIndex) => {
            const bubble = {};
            bubble.pos = (() => {
                const y = bubbleIndex * interval + surfaceYPos;
                const angle = y * 2 * Math.PI / cycle + phase;
                const adjustedAmp = amp * Math.pow(bubbleIndex, ampCf);
                const x = Math.sin(angle) * adjustedAmp + originPos.x;
                return s.createVector(x, y);
            })();
            bubble.alpha = s.noise(bubble.pos.x, bubble.pos.y) * bubbleIndex * 10;
            bubble.size = s.noise(bubble.pos.x, bubble.pos.y) * Math.pow(bubbleIndex, 0.3) * flooder.m * 0.15;
            return bubble;
        });
        return newBubbleLine;
    });
    return newObj;
}

const draw = (obj, params, s) => {
    s.push();
    s.noStroke();
    for (const bubbleLine of obj.bubbleLines) {
        const { bubbles, isDraw } = bubbleLine;
        if (isDraw) {
            bubbles.forEach((bubble, index) => {
                const { pos, alpha, size } = bubble;
                s.fill(208, 173, 167, alpha);
                if (index != 0) s.circle(pos.x, pos.y, size);
            });
        }
    }
    s.pop();
}

export const bubble = { init, update, draw };