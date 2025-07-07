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
//import initDisclosures from "./disclosure.js";
import Lenis from 'lenis';

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

document.documentElement.style.setProperty("--scroll-width", `${window.innerWidth - document.documentElement.offsetWidth}px`);
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

// initFooterSubscription();

// function initFooterSubscription() {
// 	const form = document.querySelector("#subscribe-form");
// 	const input = document.querySelector(".subscribe__input");
// 	const errorModalBody = document.querySelector(`[data-drawer="subscription-error"] .drawer__body`);
// 	const errorMsgTemplate = errorModalBody.innerHTML;

// 	const send = async (token) => {
// 		const API_KEY = "11EB8AC1618FB46A9AAE12EE88221E3B";
// 		const email = input.value;
// 		try {
// 			const response = await fetch("https://api.adwayusa.com/add/email", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "multipart/form-data",
// 				},
// 				body: JSON.stringify({
// 					API_KEY,
// 					data: {
// 						email,
// 					},
// 				}),
// 			});
			
// 			if (response.ok) {
// 				// const result = await response.json();
// 				window.app.drawers.open("subscription-success");
// 			} else {
// 				throw new Error(response.statusText);
// 			}
// 		} catch(ex) {
// 				console.error(ex);
// 			errorModalBody.innerHTML = errorMsgTemplate.replace("{{error-msg}}", `Error: ${ex.message}`);
// 			window.app.drawers.open("subscription-error");
// 		}
// 	}
// 	form.addEventListener("submit", (e) => {
// 		e.preventDefault();

// 		grecaptcha.execute(window.app.grecaptchaSiteKey, {action: 'submit'})
// 		.then(send);
// 	});
// }



// Navigation
// document.querySelectorAll(`[href*="#"]`).forEach(elem => {
// 	elem.addEventListener("click", (e) => {
// 		e.preventDefault();
// 		const pattern = /.*?(\#.*)/;
// 		const href = elem.getAttribute("href");
// 		const match = href.match(pattern);
// 		const anchor = match ? match[1] : null;

// 		history.pushState(null, "", anchor);
// 		app.drawers.close("main-menu");
// 		window.app.lenis.scrollTo(anchor, { offset: -80 });
// 	});
// });


// document.querySelectorAll(`[data-component*=":case-studies-slider:"]`).forEach(root => {
// 	new Swiper(root, {
// 		"modules": [Navigation],
// 		wrapperClass: "case-studies__wrap",
// 		slideClass: "case-study-card",
// 		slidesPerView: 1.2,
// 		spaceBetween: 20,
// 		navigation: {
// 			prevEl: ".case-studies__prev",
// 			nextEl: ".case-studies__next"
// 		},
// 		breakpoints: {
// 			1500: {
// 				slidesPerView: 4,
// 				spaceBetween: 30,
// 			},
// 			1100: {
// 				slidesPerView: 4,
// 				spaceBetween: 20,
// 			},
// 			800: {
// 				slidesPerView: 3,
// 				spaceBetween: 20,
// 			},
// 			560: {
// 				slidesPerView: 2,
// 				spaceBetween: 20,
// 			}
// 		}
// 	});
// });
// document.querySelectorAll(`[data-component*=":trusted-by-slider:"]`).forEach(root => {
// 		console.log(root);
// 	new Swiper(root, {
// 		wrapperClass: "trusted-by__list",
// 		slideClass: "trusted-by__item",
// 		"modules": [Autoplay],
// 		"loop": true,
// 		speed: 4000,
// 		"autoplay": {
// 			"delay": 0,
// 			disableOnInteraction: false,
// 		},
		
// 		"slidesPerView": "auto",
// 		"freeMode": true,
// 		spaceBetween: 20,
// 	});
// });