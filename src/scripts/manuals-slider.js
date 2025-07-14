import Swiper from "swiper";
import throttle from "lodash.throttle";

if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}

function init() {
	document.querySelectorAll(`[data-component~="manuals"]`).forEach(root => {
		const sliderRoot = root.querySelector(`[data-elem="manuals.slider"]`);

		let slider = new Swiper(sliderRoot, {
			grabCursor: true,
			slidesPerView: 1.1,
			breakpoints: {
				900: {
					slidesPerView: 3,
				},
				600: {
					slidesPerView: 1.25,
				},
			}
		});
		
		const updateSpaceBetween = () => {
			const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
			if (window.innerWidth > 600) {
				slider.params.spaceBetween = rem * 20;
			} else {
				slider.params.spaceBetween = rem * 16;
			}
			slider.update();
		};
		updateSpaceBetween();
		window.addEventListener("resize", throttle(updateSpaceBetween, 50));
	});
}