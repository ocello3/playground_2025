const footerTemplate = () => {
	return `
	<ul class="uk-breadcrumb">
		<li><span>&copy; 2022 ocello3</span></li>
		<a href="" class="uk-icon-link" uk-icon="twitter"></a>
		<a href="" class="uk-icon-link" uk-icon="github"></a>
	</ul>
	`;
}

export const renderFooter = (id) => {
	const text = footerTemplate();
	document.getElementById(id).innerHTML = text;
}
