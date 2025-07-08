import Inputmask from "inputmask/dist/inputmask.es6.js";

// Focus Application form  by button click
// $("#start-application-btn").click(() => {
// 	$(document.forms["vacancy-application-form"]["name"]).trigger("focus");
// });
// // Init vacancy application form validation

if (document.readyState == "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}

function init() {
	$.validator.addMethod("max-file-size", function(value, elem, params) {
		return [...elem.files].every(file => file.size <= params * 1024);
	}, "file size missmatch");
	$.validator.addMethod("tel", function(value, elem, params) {
		return /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/.test(elem.value);
	}, "wrong telephone");
	$.validator.addMethod("extension", function(value, elem, params) {
		const pattern = $(elem).attr("accept").replace(".", "").split(",").join("|");
		return [...elem.files].every(file => file.name.search(new RegExp(`${pattern}$`, "i")) !== -1);
	}, "file extension missmatch");
	const messagesScript = document.querySelector('script[data-elem="validate.messages"]');
	const messages = JSON.parse(messagesScript.textContent);
	$.extend($.validator.messages, messages);
	$(`[data-component~="form"]`).each(initForm);

	document.querySelectorAll(`[data-component~="tel-input"]`).forEach(root => {
		Inputmask({ mask: "+7 (999) 999-99-99", rightAlign: false }).mask(root);
	});
}


export function initForm() {
	const $root = $(this);

	const validator = $root.validate({
		ignore: [],
		errorClass: "field__error",
		//showMultipleErrors: true,
		highlight: function(element, errorClass, validClass) {
			$(element).closest(".field,.files-field").addClass("field_error");
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).closest(".field,.files-field").removeClass("field_error");
		},
		errorPlacement: function(error, element) {
			switch(element.attr("type")) {
				case "checkbox":
					error.appendTo(element.closest(".field").find(".field__info"));
					break;
				case "file":
					error.appendTo(element.closest(".files-field").find(".files-field__body"));
					break;
				default:
					error.appendTo(element.closest(".field"));
			}
		},
		// showErrors: function(errorMap, errorList) {
		// 	// Сначала снимаем классы ошибок у всех полей
		// 	$(".field").removeClass("is-error");
		// 	$(".field__info").removeClass("is-error");

		// 	// Потом заново расставляем классы, основываясь на текущих ошибках
		// 	errorList.forEach((error) => {
		// 		console.log(errorMap[error.element], error);
		// 	});

		// 	// Важно! Не забываем отрисовать ошибки, если ты вдруг добавишь кастомные
		// 	this.defaultShowErrors();
		// },
		// Отправляем данные на сервер
		submitHandler: async function(form, event) {
			event.preventDefault();
			const callback = form.getAttribute("data-callback");
			if (callback && typeof window[callback] === "function") {
				window[callback](form);
			}
		}
	});
	$root.find("input[type=file]").each(function (idx, elem) {
		$(this).on("change", function() { $(this).valid() });
	});
	return validator;
}