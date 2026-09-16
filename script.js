let taps = 0;
let timer = null;
let editMode = false;

const gc = document.getElementById("gc");
const th = document.getElementById("th");
const passCard = document.querySelector(".pass-card");
const qrImage = document.getElementById("qr-image");
const qrButton = document.querySelector(".qr-btn");
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}

function formatPassDate(date) {
  const day = date.getDate();
  const suffix = day % 10 === 1 && day % 100 !== 11 ? "st"
    : day % 10 === 2 && day % 100 !== 12 ? "nd"
    : day % 10 === 3 && day % 100 !== 13 ? "rd" : "th";
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day}${suffix} ${month}, ${date.getFullYear()}`;
}

function setPassDates() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  document.getElementById("start-date").textContent = formatPassDate(firstDayOfMonth);
  document.getElementById("end-date").textContent = formatPassDate(lastDayOfMonth);
}

setPassDates();

qrButton.addEventListener("click", () => {
  const showingQr = passCard.classList.contains("showing-qr");
  if (showingQr) {
    passCard.classList.remove("showing-qr");
    qrButton.textContent = "View QR";
    return;
  }

  qrImage.src = "qr_img.png";
  passCard.classList.add("showing-qr");
  qrButton.textContent = "Back to Pass";
});

gc.addEventListener("click", () => {
  taps++;
  gc.classList.add("flash");
  setTimeout(() => gc.classList.remove("flash"), 110);
  if (taps >= 2) { th.textContent = `${taps}/5`; th.classList.add("visible"); }
  clearTimeout(timer);
  timer = setTimeout(() => { taps = 0; th.classList.remove("visible"); }, 3000);
  if (taps >= 5) { taps = 0; th.classList.remove("visible"); clearTimeout(timer); toggle(); }
});

function toggle() {
  editMode = !editMode;
  document.body.classList.toggle("edit-mode", editMode);
  toast(editMode ? "✏️ Edit mode on" : "✅ Edit mode off");
}

document.querySelectorAll(".editable-text").forEach((el) => {
  el.addEventListener("click", function () {
    if (!editMode || this.querySelector("input")) return;
    const cur = this.textContent.trim();
    const cs = window.getComputedStyle(this);
    const inp = document.createElement("input");
    inp.type = "text"; inp.value = cur; inp.className = "inline-input";
    inp.style.fontSize = cs.fontSize; inp.style.fontWeight = cs.fontWeight;
    inp.style.textAlign = cs.textAlign; inp.style.width = `${Math.max(this.offsetWidth, 60)}px`;
    this.textContent = ""; this.appendChild(inp); inp.focus(); inp.select();
    const done = () => { this.textContent = inp.value.trim() || cur; toast("Saved!"); };
    inp.addEventListener("blur", done);
    inp.addEventListener("keydown", (event) => {
      if (event.key === "Enter") inp.blur();
      if (event.key === "Escape") { inp.value = cur; inp.blur(); }
    });
  });
});

function toast(message) {
  const toastElement = document.getElementById("toast");
  toastElement.textContent = message;
  toastElement.classList.add("show");
  setTimeout(() => toastElement.classList.remove("show"), 2200);
}
