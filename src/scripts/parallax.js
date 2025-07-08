import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}

function init() {
	document.querySelectorAll(`[data-component~="parallax"]`).forEach(root => {
		gsap.fromTo(root, {
				y: 0,
			}, {
				y: "20%",
				scrollTrigger: {
					trigger: root,
					scrub: 1,
					start: "top bottom",
					end: "bottom top",
				}
			});
	});
}