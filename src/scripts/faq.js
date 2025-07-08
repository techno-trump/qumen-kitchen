import { Disclosure } from "./disclosure.js";
if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}

function init() {
	document.querySelectorAll(`[data-component~="faq"]`).forEach(root => {
		let active = null;
		const items = Array.from(root.querySelectorAll(`[data-elem="faq.item"]`)).map(elem => new Disclosure(elem));
		const onOpen = ({ detail }) => {
			const { self } = detail;
			if (active === self) return;
			active?.close();
			active = self;
		};
		items.forEach(instance => instance.dom.root.addEventListener("disclosure.open", onOpen));
	});
}