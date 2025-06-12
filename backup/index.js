import { renderSketchList } from './component/sketchList.js';
import { renderFooter } from './component/footer.js';

const render = () => {
	renderSketchList('body', './sketch/sketch.json');
	renderFooter('footer');
}

render();
