const dragOverHandler = (event) => {
	event.preventDefault();
};
export const instances = new Set();
const entrees = new Set();
const getFileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;
export class SelectedChip {
	constructor(file, owner) {
		this.file = file;
		this.owner = owner;
		this.root = document.createElement("div");
		this.root.classList.add("files-field__file-chip");
		this.root.innerHTML = `<div class="files-field__file-name">${file.name}</div>
														<button type="button" class="files-field__file-drop-btn link">
															<div class="link__icon icon-drop"></div>
															<div class="link__label link__label_hidden">Удалить файл</div>
														</button>`;
		owner.dom.selected.append(this.root);
		this.root.addEventListener("click", (event) => event.target.matches("button, button *") && this.drop(event));
	}
	drop(event) {
			console.log(event);
		event.preventDefault();
		event.stopImmediatePropagation();
		this.owner.dropFile(this.file);
	}
	dropElem() {
		this.root.remove();
	}
}
export class FileDrop {
	constructor(root) {
		instances.add(this);
		this.dom = { root, input: root.querySelector("input") };
		this.selectedMap = new Map();
		this.dom.selected = root.querySelector(`[data-elem="file-drop.selected"]`);
		
		
		this.dom.input.addEventListener("change", () => {
			this.updateSelectedView();
			root.dispatchEvent(new Event("blur", { bubbles: true }));
		});
		
		root.addEventListener("drop", (e) => this.dropHandler(e));
		root.addEventListener("dragover", dragOverHandler);
	}
	dropFile(file) {
		const dataTransfer = new DataTransfer(); // или ClipboardEvent('').clipboardData в старых браузерах
		// Добавляем файлы из первого списка
		for (const inputFile of this.dom.input.files) {
			if (inputFile !== file) dataTransfer.items.add(inputFile);
		}
		this.dom.input.files = dataTransfer.files;
		this.dom.input.dispatchEvent(new Event("change", { bubbles: true }));
	}
	updateSelectedView() {
		const dom = this.selectedMap.entries();
		const selectedList = Array.from(this.dom.input.files);
		const selectedKeysSet = new Set(selectedList.map(file => getFileKey(file)));
			console.log(selectedList, this.selectedMap);
		for (const [fileKey, instance] of dom) {
				console.log(fileKey, instance, dom);
			if (selectedKeysSet.has(fileKey)) continue;
			instance.dropElem();
			this.selectedMap.delete(fileKey);
		}
		for (const file of selectedList) {
			const fileKey = getFileKey(file);
				console.log(fileKey, file);
			if (this.selectedMap.has(fileKey)) continue;
				console.log("New chip");
			this.selectedMap.set(fileKey, new SelectedChip(file, this));
		}
		this.dom.root.classList.toggle("files-field_files-selected", this.selectedMap.size > 0);
	}
	dropHandler(event) {
		event.preventDefault();
		entrees.clear(); // Чистим глобальный счётчик dragenter/leave
		instances.forEach((instance) => instance.setActive(false));
		const dropedFiles = getDropedFiles(event);
		if (dropedFiles instanceof FileList) {
			this.dom.input.files = mergeFileLists(this.dom.input.files, dropedFiles);
		}
		this.dom.input.dispatchEvent(new Event("change", { bubbles: true }));
	};
	setActive(next) {
		this.dom.root.classList.toggle("files-field_active", next);
	}
}
window.addEventListener("dragenter", ({ target }) => {
			entrees.add(target);
			if (entrees.size === 1) instances.forEach((instance) => instance.setActive(true));
		});
window.addEventListener("dragleave", ({ target }) => {
			entrees.delete(target);
			if (!entrees.size) instances.forEach((instance) => instance.setActive(false));
		});

if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}

function init() {
	document.querySelectorAll(`[data-component~="file-drop"]`).forEach(root => new FileDrop(root));
}

function getDropedFiles(event) {
	return event.dataTransfer.files;
}
function mergeFileLists(fileList1, fileList2) {
  const dataTransfer = new DataTransfer(); // или ClipboardEvent('').clipboardData в старых браузерах
  // Добавляем файлы из первого списка
  for (const file of fileList1) {
    dataTransfer.items.add(file);
  }
  // Добавляем файлы из второго списка
  for (const fileFromList2 of fileList2) {
		let found = false;
		for (const fileFromList1 of fileList1) {
			const fileAKey = getFileKey(fileFromList2);
			const fileBKey = getFileKey(fileFromList1);
			if (fileAKey === fileBKey) {
				found = true;
				break;
			};
		}
		if (!found) {
			dataTransfer.items.add(fileFromList2);
		}
  }
  return dataTransfer.files; // это будет новый FileList
}