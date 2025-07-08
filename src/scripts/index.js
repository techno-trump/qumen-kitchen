import "../styles/index.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import "vanilla-drawers";
import throttle from "lodash.throttle";
import initDisclosures from "./disclosure.js";
import "./burger-menu.js";
import "./about-products.js";
import "./projects.js";
import "./ideas.js";
import "./manuals-slider.js";
import "./advantages.js";
import "./faq.js";
import "./file-drop.js";
import "./forms.js";
import "./parallax.js";
import "./text-reveal.js";
import "./builder-widget.js";
import "./header-color-controller.js";
import { isMobile } from "./utils.js";
import Lenis from 'lenis';

if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}

function init() {
	gsap.fromTo(".hero__overlay", {
			opacity: 0
		},
		{
			opacity: 1,
			scrollTrigger: {
				trigger: ".about-product",
				scrub: 0.5,
				start: "top bottom",
				end: "bottom-=10% bottom"
			}
		}
	)

	gsap.registerPlugin(ScrollTrigger);

	window.app = window.app || {};
	window.app.hoverMedia = window.matchMedia("(any-hover: hover)");
	window.app.lenis =  new Lenis({
		autoRaf: true,
	});

	document.documentElement.classList.toggle("is-mobile", isMobile.any());

	document.addEventListener("scroll", throttle(() => {
		document.documentElement.classList.toggle("_scrolled", window.scrollY > 50);
	}));

	initDisclosures();
	app.drawers.init();

	app.drawers.get("marketplaces")?.setOptions({ "lockPageScroll": false });

	app.drawers.get("cookies-agreement")?.setOptions({ closeOnUnderlayClick: false });
	app.drawers.get("cookies-agreement")?.on("close", () => {
		localStorage.setItem('cookiesAgreementShowed', 'true');
	});
	app.drawers.get("marketplaces")?.on("open", () => {
		app.drawers.close("message-us");
	});
	app.drawers.get("message-us")?.on("open", () => {
		app.drawers.close("marketplaces");
	});
	document.querySelector("#cookies-agreement-btn")?.addEventListener("click", () => {
		localStorage.setItem('cookiesAccepted', 'true');
	});
	if (!localStorage.getItem('cookiesAccepted')) {
		app.drawers.open("cookies-agreement");
	}

	if (window.location.hash) {
		setTimeout(() => window.app.lenis.scrollTo(window.location.hash, { offset: -40, duration: 0, lerp: 0 }), 500);
	}
	document.querySelectorAll(`[href*="#"], [href*="/#"]`).forEach(elem => {
		elem.addEventListener("click", (e) => {
			const href = elem.href;
			app.drawers.close("navigation");
			if (!href.includes(window.location.host + window.location.pathname)) return;
			e.preventDefault();
			const pattern = /.*?(\#.*)/;
			const match = href.match(pattern);
			const anchor = match ? match[1] : null;
			if (anchor === "#") return;
			history.pushState(null, "", anchor);
			window.app.lenis.scrollTo(anchor, { offset: -40, duration: 0, lerp: 0 });
		});
	});

	setScrollSize();
	const rootResizeObserver = new ResizeObserver(() => setScrollSize());
	rootResizeObserver.observe(document.documentElement);
	function setScrollSize() {
		setTimeout(() => {
			const scrollWidth = window.innerWidth - document.documentElement.offsetWidth;
			if (scrollWidth > 30) return setScrollSize();
			document.documentElement.style.setProperty("--scroll-width", `${window.innerWidth - document.documentElement.offsetWidth}px`);
		}, 200);
	}

	trackViewHeight();

	function trackViewHeight() {
		var lastValue = null;

		window.addEventListener("resize", throttle(update, 50));
		update();

		function update() {
			if (lastValue !== null && Math.abs(lastValue - window.innerHeight) <= 40) return;
			lastValue = window.innerHeight;
			document.documentElement.style.setProperty("--vhu", `${lastValue / 100}px`);
		}
	}

	fsLightbox?.props.onOpen = function(instance) {
		instance.swc.parentElement.setAttribute("data-lenis-prevent", true);
		instance.swc.setAttribute("data-lenis-prevent", true);
		console.log(instance);
		// <iframe id={`manual-${idx + 1}`} class="manuals__card-frame" src={videoSrc}
		// 	width="853"
		// 	height="480"
		// 	allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
		// 	frameborder="0"
		// 	allowfullscreen>
		// </iframe>
	};
	setTimeout(() => document.documentElement.classList.add("_initialized"), 100);
}