import Swiper from "swiper";
import { Thumbs, EffectFade } from "swiper/modules";
import { makeSliderActive } from "./active-slider.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(`[data-component~="about-product"]`).forEach(root => {
	const sliderRoot = root.querySelector(`[data-elem="about-product.slider"]`);
	const thumbsRoot = root.querySelector(`[data-elem="about-product.thumbs"]`);
	const thumbs = Array.from(thumbsRoot.querySelectorAll(`[data-elem="about-product.thumb"]`));
	const prevBtn = root.querySelector(`[data-elem="about-product.prev"]`);
	const nextBtn = root.querySelector(`[data-elem="about-product.next"]`);
	const thumbsSlider = new Swiper(thumbsRoot, {
		grabCursor: true,
		slidesPerView: 1.045,
		slideToClickedSlide: true,
		watchSlidesProgress: true,
		breakpoints: {
			900: {
				slidesPerView: "auto",
			},
			600: {
				slidesPerView: 1.26,
			}
		},
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

	gsap.fromTo(thumbs, {
			y: "10%",
			opacity: 0,

		}, {
			y: "0",
			opacity: 1,
			stagger: 0.1,
			scrollTrigger: {
				trigger: thumbsRoot,
				start: "top+=80% bottom",
				toggleActions: "play none none reverse",
			}
		});
});