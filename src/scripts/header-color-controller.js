const header = document.getElementById('header');
let observer = null;
const stack = [];
const map = new WeakMap();
// Создаем наблюдатель

window.addEventListener("resize", rebuildObserver);
rebuildObserver();

function rebuildObserver() {
	if (!header) return;
	observer?.disconnect();
	observer = new IntersectionObserver(
		(entries) => {
			let theme;
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					stack.push(entry.target);
					map.set(entry.target, stack.length - 1);
				} else {
					stack[map.get(entry.target)] = null;
				}
				while(stack.length && !stack[stack.length - 1]) {
					stack.pop();
				}
				if (stack.length) {
					theme = stack[stack.length - 1].dataset.theme;
				} else {
					theme = 'dark';
				}
				header.classList.toggle('dark-context', theme === 'dark');
				header.classList.toggle('light-context', theme !== 'dark');
			});
		},
		{
			root: null, // viewport
			threshold: 0, // когда любая часть секции соприкасается
			rootMargin: `0px 0px -${window.innerHeight - header.offsetHeight}px 0px` // учитывать высоту header
		}
	);

	// Отмечаем каждую секцию для наблюдения
	document.querySelectorAll('section[data-theme]').forEach((section) => {
		observer.observe(section);
	});
}