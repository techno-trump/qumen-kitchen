import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { CustomEase } from "gsap/CustomEase.js";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}

function init() {
	//wrap lines
	document.querySelectorAll(".line").forEach(root => {
		if (root.closest(".line-wrap")) return;
		const wrap = document.createElement("div");
		wrap.classList.add("line-wrap");
		root.replaceWith(wrap);
		wrap.append(root);
	});

	document.querySelectorAll(`[data-component~="text-reveal"`).forEach(root => {
		const immediate = root.getAttribute("data-immediate");
		const scrollTrigger = !immediate && {
					trigger: root,
					start: "top+=100% bottom",
					toggleActions: "play none none reverse",
				} || undefined;
		gsap.fromTo(root.querySelectorAll(".line"), {
				y: "100%",
			}, {
				y: "0",
				stagger: 0.1,
				duration: 0.6,
				scrollTrigger,
				ease: CustomEase.create("custom", "0.4, 0.2, 0.2, 1"),
			});
		if (immediate == "init") {

		}
	});

	document.querySelectorAll(`[data-component~="text-block-reveal"`).forEach(root => {
		gsap.fromTo(root, {
				opacity: 0,
				y: "1em",
			}, {
				opacity: 1,
				y: "0",
				duration: 0.6,
				scrollTrigger: {
					trigger: root,
					start: "top+=100% bottom",
					toggleActions: "play none none reverse",
				},
				ease: CustomEase.create("custom", "0.4, 0.2, 0.2, 1"),
			});
	});
}