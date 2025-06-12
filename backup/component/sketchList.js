import { translateDate } from './translateDate.js';

const sketchListTemplate = (date, title, note) => {
	const formatedDate = translateDate(date);
	const linkToSketch = `./sketch/${date}/sketch.html`;
	const linkToGitHub = `https://github.com/ocello3/sketch/${date}`;
	return `
	<tr>
		<td>${formatedDate}</td>
		<td><a class="uk-button uk-button-default uk-button-small" href="${linkToSketch}">play</a></td>
		<td><a class="uk-button uk-button-primary uk-button-small" href="${linkToGitHub}">code</a></td>
		<td>${title}</td>
		<td>${note}</td>
	</tr>`
}

export const renderSketchList = async (id, jsonPath) => {
	const dataArrayRes = await fetch(jsonPath);
	const dataArray = await dataArrayRes.json();
	const sortedDates = Object.keys(dataArray).sort((a, b) => b - a);
	const header = `
		<table class="uk-table uk-table-divider">
		<thead>
			<tr>
				<th>date</th>
				<th><span uk-icon="play"></span></th>
				<th><span uk-icon="code"></span></th>
				<th>title</th>
				<th>note</th>
			</tr>
		</thead>
		<tbody>`;
	const footer = '</tbody></table>';
	let text = '';
	text = text.concat(header);
	for (const date of sortedDates) {
		const data = dataArray[date];
		const title = data.title;
		const note = data.note;
		const thisText = sketchListTemplate(date, title, note);
		text = text.concat(thisText);
	}
	text = text.concat(footer);
	document.getElementById(id).innerHTML = text;
}
