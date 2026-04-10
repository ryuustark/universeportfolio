/**
 * 3D Skill Wheel controller.
 * Manages wheel state, rotation, and navigation.
 * Uses CSS 3D transforms (rotateY + translateZ) for the carousel effect.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform
 */
import { WHEEL_ITEMS } from "./data.js";
import { renderTree } from "./tree-renderer.js";

// Constants
const WC = WHEEL_ITEMS.length;
const WSTEP = 360 / WC;
const WRADIUS = 200;

// State
let wIdx = 0;
let wAngle = 0;
let wLocked = false;
let curTree = "salesforce";

// State accessors
export function getCurTree() { return curTree; }

/** Build wheel DOM elements in the rotor container */
export function buildWheel() {
  const rotor = document.getElementById("wheel-rotor");
  rotor.innerHTML = "";
  WHEEL_ITEMS.forEach((item, i) => {
    const d = document.createElement("div");
    d.className = "wheel-item" + (i === wIdx ? " active" : "");
    d.style.transform = `rotateY(${i * WSTEP}deg) translateZ(${WRADIUS}px)`;
    d.innerHTML = `<span class="wi-name">${item.label}</span><div class="wi-bar"><div class="wi-fill" style="width:${item.level}%"></div></div><span class="wi-level">${item.level}</span>`;
    d.addEventListener("click", () => wheelGo(i, true));
    rotor.appendChild(d);
  });
  applyWheel();
}

/** Apply current rotation angle and update item visibility */
function applyWheel() {
  document.getElementById("wheel-rotor").style.transform = `rotateY(${wAngle}deg)`;
  document.querySelectorAll(".wheel-item").forEach((el, i) => {
    let net = ((i * WSTEP) + wAngle) % 360;
    if (net > 180) net -= 360;
    if (net < -180) net += 360;
    const abs = Math.abs(net);
    el.style.opacity = (0.1 + ((Math.cos(abs * Math.PI / 180) + 1) / 2) * 0.9).toFixed(3);
    el.classList.toggle("active", i === wIdx);
    el.style.pointerEvents = abs >= 90 ? "none" : "auto";
  });
}

/** Navigate wheel to a target index */
export function wheelGo(target, fromClick = false) {
  if (target === wIdx && !fromClick) return;
  let d = target - wIdx;
  if (d > WC / 2) d -= WC;
  if (d < -WC / 2) d += WC;
  wAngle -= d * WSTEP;
  wIdx = target;
  applyWheel();
  curTree = WHEEL_ITEMS[target].key;
  document.getElementById("info-panel").classList.remove("visible");
  renderTree(curTree);
  if (fromClick) {
    document.getElementById("constellation-panel").classList.add("revealed");
    document.body.classList.add("constellation-mode");
  }
}

/** Handle scroll events on the wheel (with debounce) */
export function handleWheelScroll(e) {
  e.preventDefault();
  if (wLocked) return;
  wLocked = true;
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  wheelGo((wIdx + (d > 0 ? 1 : -1) + WC) % WC, false);
  setTimeout(() => { wLocked = false; }, 650);
}
