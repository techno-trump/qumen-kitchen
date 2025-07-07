import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";
gsap.registerPlugin(ScrollTrigger);

function areRectsIntersecting(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

document.querySelectorAll(`[data-component~="builder-widget"]`).forEach(root => {
	const footer = document.querySelector(`footer`);
	const main = document.querySelector(`[data-elem="builder-widget.main"]`);
	const topAnchor = document.querySelector(`[data-elem="builder-widget.top-anchor"]`);
	const bottomAnchor = document.querySelector(`[data-elem="builder-widget.bottom-anchor"]`);
	const panel = root.querySelector(`[data-elem="builder-widget.panel"]`);

	const recalcPosition = () => {
		const position = calcContainerPosition();
		root.style.setProperty("--top", position.top);
		root.style.setProperty("--right", position.right);
		root.style.setProperty("--bottom", position.bottom);
		root.style.setProperty("--left", position.left);
	};
	setTimeout(recalcPosition, 500);
	
	const recalcIntersection = () => {
		const footerBcr = footer.getBoundingClientRect(); 
		const panelBcr = panel.getBoundingClientRect();
		panel.classList.toggle("_docking", areRectsIntersecting(footerBcr, panelBcr));
		
	};

	recalcPosition();

	window.addEventListener("resize", recalcPosition);
	window.addEventListener("orientationchange", recalcPosition);

	
	window.addEventListener("scroll", throttle(recalcPosition, 100));
	window.addEventListener("scroll", throttle(recalcIntersection, 25));

	root.classList.add("_initialized");

	function calcContainerPosition() {
		const mainBcr = main.getBoundingClientRect();
		const topAnchorBcr = topAnchor.getBoundingClientRect();
		const bottomAnchorBcr = bottomAnchor.getBoundingClientRect();
		const bodyBcr = document.documentElement.getBoundingClientRect();
		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
		recalcIntersection();
			//console.log(window.innerHeight, rem, window.innerHeight - 20 - rem / 16 * 60);
		return {
			left: `${topAnchorBcr.left}px`,
			right: `${Math.max(document.documentElement.offsetWidth - bottomAnchorBcr.right, 20)}px`,
			top: `${Math.min(topAnchorBcr.top - mainBcr.top, window.innerHeight - 20 - rem / 16 * 60)}px`,
			bottom: `${document.documentElement.offsetHeight - (bottomAnchorBcr.bottom - bodyBcr.top)}px`
		};
	}
});