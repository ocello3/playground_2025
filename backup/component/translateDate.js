const translateMonth = (month) => {
	if (month === '01') return 'Jan';
	if (month === '02') return 'Feb';
	if (month === '03') return 'Mar';
	if (month === '04') return 'Apr';
	if (month === '05') return 'May';
	if (month === '06') return 'Jun';
	if (month === '07') return 'Jul';
	if (month === '08') return 'Aug';
	if (month === '09') return 'Sep';
	if (month === '10') return 'Oct';
	if (month === '11') return 'Nov';
	if (month === '12') return 'Dec';
	throw 'invalid month';
}

export const translateDate = (date) => {
	const year = date.substring(0, 4);
	const month = translateMonth(date.substring(4, 6));
	const day = date.substring(6, 8);
	return `${month} ${day}, ${year}`;
}
