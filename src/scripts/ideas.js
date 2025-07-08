import Swiper from "swiper";
import { Thumbs, EffectFade } from "swiper/modules";
import { makeSliderActive } from "./active-slider.js";
import { addLeadingZero } from "./utils.js";

if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}
function init() {
	document.querySelectorAll(`[data-component~="ideas"]`).forEach(root => {
		const sliderRoot = root.querySelector(`[data-elem="ideas.slider"]`);
		const thumbsRoot = root.querySelector(`[data-elem="ideas.thumbs"]`);
		const thumbs = Array.from(thumbsRoot.querySelectorAll(`[data-elem="ideas.thumb"]`));
		const prevBtn = root.querySelector(`[data-elem="ideas.prev"]`);
		const nextBtn = root.querySelector(`[data-elem="ideas.next"]`);
		const current = root.querySelector(`[data-elem="ideas.current"]`);
		const total = root.querySelector(`[data-elem="ideas.total"]`);
		
		const thumbsSlider = new Swiper(thumbsRoot, {
			grabCursor: true,
			slidesPerView: "auto",
		});
		const slider = new Swiper(sliderRoot, {
			modules: [Thumbs, EffectFade],
			effect: 'fade',
			speed: 600,
			fadeEffect: {
				crossFade: true, // true = плавное исчезновение предыдущего слайда
			},
			thumbs: {
				swiper: thumbsSlider,
			},
			on: {
				slideChange(self) {
					current.textContent = addLeadingZero(self.realIndex + 1);
					thumbsSlider.slideTo(self.realIndex);
				}
			}
		});
		nextBtn.addEventListener("click", () => {
			if (slider.realIndex >= slider.slides.length - 1) {
				slider.slideTo(0); // перейти к первому
			} else {
				slider.slideTo(slider.realIndex + 1);
			}
		});
		prevBtn.addEventListener("click", () => {
			if (slider.realIndex <= 0) {
				slider.slideTo(slider.slides.length - 1); // перейти к первому
			} else {
				slider.slideTo(slider.realIndex - 1);
			}
		});
		makeSliderActive(slider, thumbs);
		total.textContent = addLeadingZero(slider.slides.length);
	});
}