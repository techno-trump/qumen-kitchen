import './hoisted.mS1ZopMs.js';

document.addEventListener("DOMContentLoaded", function() {
  var params = decodeURIComponent(window.location.search.substring(1));
  var planplace_container = document.getElementById("planplace_container");
  var iframe = document.createElement("iframe");
  iframe.id = "planplace";
  iframe.allowFullscreen = true;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.minHeight = "700px";
  iframe.style.border = "0";
  iframe.src = "https://planplace.ru/clients/35218700/";
  if (params !== "") iframe.src = iframe.src + "?" + params;
  planplace_container?.appendChild(iframe);
});
