import Swiper from "swiper";

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