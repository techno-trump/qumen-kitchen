import Swiper from "swiper";
import { Navigation, Pagination, EffectCreative } from "swiper/modules";
import { Disclosure } from "./disclosure.js";
import throttle from "lodash.throttle";

const activeItemClass = "projects__info-item_active";
class InfoItem {
	constructor(root) {
		this.root = root;
		this.active = root.querySelector(`[data-elem="projects.info.item"].${activeItemClass}`);
		this.items = Array.from(root.querySelectorAll(`[data-elem="projects.info.item"]`));
		this.chars = root.querySelector(`[data-elem="projects.info.chars"]`);
		this.charsDisclosure = new Disclosure(this.chars);
	}
}
class Info {
	constructor(root) {
		this.items = Array.from(root.querySelectorAll(`[data-elem="projects.info.item"]`)).map(root => new InfoItem(root));
	}
	setActive(idx) {
		this.items.forEach((item, itemIdx) => {
			const activeSlide = itemIdx === idx;
			item.root.classList.toggle(activeItemClass, activeSlide);
			if (!activeSlide) item.charsDisclosure.close();
		});
	}
}

if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}
function init() {
	document.querySelectorAll(`[data-component~="projects"]`).forEach(root => {
		const sliderRoot = root.querySelector(`[data-elem="projects.slider"]`);
		const paginationRoot = root.querySelector(`[data-elem="projects.pagination"]`);
		const prevBtn = root.querySelector(`[data-elem="projects.prev"]`);
		const nextBtn = root.querySelector(`[data-elem="projects.next"]`);
		const info = new Info(root);

		let slider = initSlider();

		const updateSpaceBetween = () => {
			const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
			if (window.innerWidth > 900) {
				slider.params.spaceBetween = 0;
			} else if (window.innerWidth > 600) {
				slider.params.spaceBetween = rem * 20;
			} else {
				slider.params.spaceBetween = rem * 10;
			}
			slider.update();
		};
		updateSpaceBetween();
		window.addEventListener("resize", throttle(updateSpaceBetween, 50));
		
		function initSlider() {
			return new Swiper(sliderRoot, {
				modules: [Navigation, EffectCreative, Pagination],
				//effect: 'creative',
				speed: 600,
				loop: true,
				slidesPerView: 1,
				breakpoints: {
				},
				creativeEffect: {
					prev: {
						shadow: false,
						translate: ['0%', 0, 0], // следующий слайд — наезжает поверх текущего
					},
					next: {
						shadow: false,
						translate: ['100%', 0, 1], // предыдущий слайд — назад
					},
				},
				pagination: {
					el: paginationRoot
				},
				navigation: {
					nextEl: nextBtn,
					prevEl: prevBtn
				},
				on: {
					slideChange(self) {
						info.setActive(self.realIndex);
					}
				}
			});
		}
	});
}