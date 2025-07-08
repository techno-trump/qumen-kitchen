import Swiper from "swiper";

if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}

function init() {
	document.querySelectorAll(`[data-component~="advantages"]`).forEach(root => {
		new Swiper(root, {
			grabCursor: true,
			slidesPerView: 1.08,
			breakpoints: {
				900: {
					slidesPerView: "auto",
				},
				600: {
					slidesPerView: 1.4,
				},
			}
		});
	});
}