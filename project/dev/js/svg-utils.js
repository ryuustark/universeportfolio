/**
 * SVG utility helpers.
 * Uses createElementNS for SVG namespace elements.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
 */

/** Create an SVG element with attributes */
export function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

/** Generate star polygon points for SVG <polygon> */
export function starPts(cx, cy, outerR, innerR, points) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(" ");
}
