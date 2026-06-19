document.addEventListener("click", function (e) {
  var trigger = e.target.closest("a.lightbox-trigger");
  if (trigger) {
    e.preventDefault();
    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    var img = document.createElement("img");
    img.src = trigger.href;
    img.alt = trigger.querySelector("img") ? trigger.querySelector("img").alt : "";
    overlay.appendChild(img);
    overlay.addEventListener("click", function () {
      overlay.remove();
    });
    document.body.appendChild(overlay);
    return;
  }
  if (e.target.closest(".lightbox-overlay")) {
    var open = document.querySelector(".lightbox-overlay");
    if (open) open.remove();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    var open = document.querySelector(".lightbox-overlay");
    if (open) open.remove();
  }
});

function openTargetDetails() {
  if (!location.hash) return;
  var el;
  try {
    el = document.querySelector(location.hash);
  } catch (err) {
    return;
  }
  if (el && el.tagName === "DETAILS") {
    el.open = true;
    el.scrollIntoView();
  }
}

window.addEventListener("DOMContentLoaded", openTargetDetails);
window.addEventListener("hashchange", openTargetDetails);
