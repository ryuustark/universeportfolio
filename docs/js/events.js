/**
 * DOM event manager.
 * Wires up all user interaction handlers.
 */
import { handleWheelScroll } from "./wheel.js";

/** Set up all event listeners */
export function setupEvents() {
  // Wheel scroll navigation
  document.getElementById("wheel-wrap").addEventListener("wheel", handleWheelScroll, { passive: false });

  // Click empty wheel space → exit constellation mode
  document.getElementById("wheel-wrap").addEventListener("click", (e) => {
    const isWheelItem = e.target.closest(".wheel-item") !== null;
    const panel = document.getElementById("constellation-panel");
    if (!isWheelItem && panel.classList.contains("revealed")) {
      panel.classList.remove("revealed");
      document.body.classList.remove("constellation-mode");
    }
  });

  // Click empty SVG area → hide info panel
  document.getElementById("constellation-svg").addEventListener("click", (e) => {
    if (e.target.tagName === "ellipse" || e.target === e.currentTarget) {
      document.getElementById("info-panel").classList.remove("visible");
    }
  });

  // MutationObserver: keep body.constellation-mode in sync with panel state
  const panel = document.getElementById("constellation-panel");
  const obs = new MutationObserver(() => {
    if (panel.classList.contains("revealed")) {
      document.body.classList.add("constellation-mode");
    } else {
      document.body.classList.remove("constellation-mode");
    }
  });
  obs.observe(panel, { attributes: true, attributeFilter: ["class"] });
}
