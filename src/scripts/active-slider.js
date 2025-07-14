import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);
import EventEmitter from "eventemitter3";

class Slide extends EventEmitter {
	static current = null;
	constructor(root, thumbRoot, slider) {
		super();
		this.root = root;
		this.thumbRoot = thumbRoot;
		this.slider = slider;
		this.updateProgress(0);
	}
	updateProgress(progress) {
		this.thumbRoot.style.setProperty("--progress", `${progress}%`);
		this.thumbRoot.style.setProperty("--progress-nu", progress);
		const svgProgress = this.thumbRoot.querySelector("svg .ideas__thumb-progress-current");
		if (svgProgress) {
			svgProgress.setAttribute("stroke-dashoffset", 56 - 0.55 * progress);
		}
	}
}
export class VideoSlide extends Slide {
	constructor(root, thumbRoot, slider) {
		super(root, thumbRoot, slider);
		this.video = root.querySelector("video");
		
		this.video.addEventListener("timeupdate", () => {
			this.progress = (this.video.currentTime / this.video.duration) * 100;
			this.updateProgress(this.progress);
		});

		this.video.addEventListener('ended', () => this.emit("ended", this));
	}
	seekToEnd() {
		this.pause();
		this.video.currentTime = this.video.duration || 0;
	}
	reset(progress = 0) {
		this.video.currentTime = 0;
		this.pause();
		this.video.currentTime = 0;
		this.progress = progress;
		this.updateProgress(this.progress);
	}
	play() {
		let tries = 0;
		clearInterval(this.interval);
		this.interval = setInterval(async () => {
				tries++;
				try {
					await this.video.play();
					clearInterval(this.interval);
				} catch(ex) {
					console.error(ex);
				};
				if (tries > 10) {
					clearInterval(this.interval);
				}
			}, 100);
	}
	pause() {
		clearInterval(this.interval);
		this.video.pause();
	}
}
export class ImageSlide extends Slide {
	constructor(root, thumbRoot, slider) {
		super(root, thumbRoot, slider);
		this.duration = root.getAttribute("data-duration") || 8000;
		this.progress = 0;
	}
	seekToEnd() {
		clearInterval(this.interval);
		this.progress = 100;
		this.updateProgress(100);
	}
	reset(progress = 0) {
		clearInterval(this.interval);
		this.progress = 0;
		this.updateProgress(progress);
	}
	tick() {
		this.progress += 100;
		this.updateProgress(this.progress / this.duration * 100); // 8s
		if (this.progress >= this.duration) {
			clearInterval(this.interval);
			this.emit("ended", this);
		}
	}
	play() {
		this.interval = setInterval(() => this.tick(), 100);
	}
	pause() {
		clearInterval(this.interval);
		this.updateProgress(100);
	}
}
export function createSlide(root, thumbRoot, slider) {
	const video = root.querySelector("video");
	if (video) return new VideoSlide(root, thumbRoot, slider);
	return new ImageSlide(root, thumbRoot, slider);
}
export function makeSliderActive(slider, thumbs) {
	const slides = slider.slides.map((root, idx) => createSlide(root, thumbs[idx], slider));

	let prevSlideIdx = 0;
	slides.forEach((slide, idx) => slide.on("ended", () => {
		if (slider.realIndex !== idx) return;
		if (slider.realIndex === slider.slides.length - 1) {
			slider.slideTo(0); // перейти к первому
		} else {
			slider.slideTo(idx + 1);
		}
	}));
	
	slider.on("slideChange", () => {
		if (prevSlideIdx > slider.realIndex) {
			for (let idx = slider.realIndex + 1; idx < slides.length; idx++) {
				slides[idx].reset();
			}
		} else {
			for (let idx = 0; idx < slider.realIndex; idx++) {
				slides[idx]?.seekToEnd();
			}
		}
		slides[slider.realIndex].play();
		prevSlideIdx = slider.realIndex;
	});
	ScrollTrigger.create({
		trigger: slider.el,
		onEnter: () => slides[0].play(),
		once: true,
	})
	
}