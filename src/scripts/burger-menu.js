import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase.js";
gsap.registerPlugin(CustomEase);

if (document.readyState == "interactive") {
	app.drawers.on("afterInit", () => init());
} else {
	window.addEventListener("DOMContentLoaded", () => app.drawers.on("afterInit", () => init()));
}

function init() {
	const header = document.querySelector("header");
	const headerContainer = document.querySelector(".header__container");
	const menuPanel = document.querySelector(".header-menu__panel");
	
	const drawer = app.drawers.get("navigation");
	if (!drawer) return;
	// const panel = drawer.dom.panel;
	// const toggleBtn = document.querySelector(`[data-drawer-toggle="navigation"]`);

	// drawer.on("beforeOpen", resetClips);
	// drawer.on("close", resetClips);

	recalcMenuPadding();
	window.addEventListener("resize", recalcMenuPadding);
	
	function recalcMenuPadding() {
		const headerBcr = header.getBoundingClientRect();
		const headerContainerBcr = headerContainer.getBoundingClientRect();

		menuPanel.style.setProperty("--padding-left", `${(headerBcr.width - headerContainerBcr.width) / 2}px`);
	}

	const showItems = gsap.timeline({ paused: true });

	showItems.fromTo(".header-menu__item-label", {
			translateY: "100%",
		}, {
			ease: CustomEase.create("cubic-bezier(0.5, 0,0,1)"),
			translateY: "0%",
			duration: 0.4,
			stagger: 0.05,
		}, "+=0.4");
	
	drawer.on("open", () => showItems.restart());
	drawer.on("close", () => showItems.reverse());

	// function resetClips() {
	// 	const toggleBtnBcr = toggleBtn.getBoundingClientRect();
	// 	const panelBcr = panel.getBoundingClientRect();
	// 	const startClipTop = ((toggleBtnBcr.top - panelBcr.top) / panelBcr.height * 100).toFixed(2);
	// 	const startClipRight = ((panelBcr.width - (toggleBtnBcr.left - panelBcr.left + toggleBtnBcr.width)) / panelBcr.width * 100).toFixed(2);
	// 	const startClipBottom = ((panelBcr.height - (toggleBtnBcr.top - panelBcr.top + toggleBtnBcr.height)) / panelBcr.height * 100).toFixed(2);
	// 	const startClipLeft = (toggleBtnBcr.left / panelBcr.width * 100).toFixed(2);
	// 	const btnBorderRadius = gsap.getProperty(toggleBtn, "border-radius").toFixed(2);
	// 	const panelBorderRadius = window.innerWidth > 900 ? gsap.getProperty(panel, "border-top-right-radius").toFixed(2) : 0;
 	// 	const startClip = `inset(${startClipTop}% ${startClipRight}% ${startClipBottom}% ${startClipLeft}% round ${btnBorderRadius}px)`;
	// 	const midClip = `inset(0% 0% 0% 0% round ${panelBorderRadius}px)`;
	// 	const endClip = `inset(0% 0% 0% 0% round 0px ${panelBorderRadius}px ${panelBorderRadius}px 0px)`;

	// 	panel.style.setProperty("--start-clip", startClip);
	// 	panel.style.setProperty("--mid-clip", midClip);
	// 	panel.style.setProperty("--end-clip", endClip);
	// }
}