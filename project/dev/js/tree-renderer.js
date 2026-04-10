/**
 * Constellation SVG renderer.
 * Renders skill tree nodes and connections into the SVG panel.
 */
import { trees } from "./data.js";
import { svgEl, starPts } from "./svg-utils.js";
import { computeLayout } from "./layout.js";

/**
 * Render a skill tree's constellation into the SVG.
 * Calls computeLayout() to dynamically position nodes.
 */
export function renderTree(key) {
  const T = trees[key];
  if (!T) return;

  // Compute dynamic positions (mutates nodes with x, y)
  computeLayout(T.nodes);

  const linesLayer = document.getElementById("lines-layer");
  const nodesLayer = document.getElementById("nodes-layer");
  linesLayer.innerHTML = "";
  nodesLayer.innerHTML = "";

  document.getElementById("tree-title").textContent = T.title;
  document.getElementById("tree-level").textContent = "Skill Level: " + T.level;

  // Build id→node lookup
  const map = {};
  T.nodes.forEach((n) => (map[n.id] = n));

  // Draw connection lines
  T.nodes.forEach((n) => {
    n.parents.forEach((pid) => {
      const p = map[pid];
      if (!p) return;
      const active = n.unlocked && p.unlocked;
      const line = svgEl("line", {
        x1: p.x, y1: p.y,
        x2: n.x, y2: n.y,
        stroke: active ? "rgba(204,0,0,0.6)" : "rgba(120,0,60,0.22)",
        "stroke-width": active ? "2" : "1.5",
      });
      if (!active) line.setAttribute("stroke-dasharray", "5,4");
      linesLayer.appendChild(line);
    });
  });

  // Draw nodes
  T.nodes.forEach((n) => {
    const g = svgEl("g", { transform: `translate(${n.x},${n.y})` });
    g.style.cursor = "pointer";
    g.addEventListener("mouseenter", () => showInfo(n));
    g.addEventListener("click", () => showInfo(n));

    const r = n.size;

    // Master glow ring
    if (n.master) {
      g.appendChild(svgEl("circle", {
        r: r + 10,
        fill: n.unlocked ? "rgba(204,0,0,0.07)" : "rgba(80,0,60,0.07)",
      }));
    }

    // Node circle (fill)
    g.appendChild(svgEl("circle", {
      r,
      fill: n.unlocked ? "rgba(60,20,40,0.9)" : "rgba(20,10,25,0.85)",
    }));

    // Node circle (border)
    g.appendChild(svgEl("circle", {
      r,
      fill: "none",
      stroke: n.unlocked ? "rgba(204,0,0,0.9)" : "rgba(120,0,60,0.5)",
      "stroke-width": n.master ? "2.5" : "1.5",
    }));

    // Master dashed outer ring
    if (n.master) {
      g.appendChild(svgEl("circle", {
        r: r + 5,
        fill: "none",
        stroke: n.unlocked ? "rgba(204,0,0,0.3)" : "rgba(120,0,60,0.15)",
        "stroke-width": "1",
        "stroke-dasharray": "4,3",
      }));
    }

    // Star icon inside node
    const star = svgEl("polygon", {
      points: starPts(0, 0, r * 0.55, r * 0.25, 5),
      fill: n.unlocked ? "#cc0000" : "#804040",
    });
    if (n.unlocked) star.setAttribute("filter", "url(#glow-accent)");
    g.appendChild(star);

    // Label below node
    const lbl = svgEl("text", {
      y: r + 14,
      "text-anchor": "middle",
      "font-family": "Cinzel,serif",
      "font-size": n.master ? "11" : "9",
      fill: n.unlocked ? "#cc0000" : "#805070",
      "letter-spacing": "1",
    });
    lbl.textContent = n.label;
    g.appendChild(lbl);

    nodesLayer.appendChild(g);
  });
}

/** Show node details in the info panel */
export function showInfo(node) {
  document.getElementById("info-name").textContent = node.label;
  document.getElementById("info-desc").textContent = node.desc;
  document.getElementById("info-rank").textContent = node.rank;
  const btn = document.getElementById("info-btn");
  btn.textContent = node.unlocked ? "Mastered \u2726" : "Planned \u2192";
  btn.disabled = true;
  document.getElementById("info-panel").classList.add("visible");
}
