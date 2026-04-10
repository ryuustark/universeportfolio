/**
 * Dynamic constellation layout engine.
 * Computes x, y positions for skill tree nodes using level-based seeded placement.
 * Supports 1–15 nodes per tree. No hardcoded coordinates needed in data.
 *
 * Algorithm:
 * 1. BFS from root to compute each node's depth level
 * 2. Distribute levels evenly across the viewport vertically (root at bottom, master at top)
 * 3. Within each level, place nodes horizontally using seeded RNG (deterministic per node id)
 * 4. Collision detection prevents overlap
 * 5. Master node always placed at top-center
 */

const VIEW_W = 600;
const VIEW_H = 500;
const PAD_X = 60;
const PAD_Y = 60;
const ROOT_Y = VIEW_H - PAD_Y - 10;   // 430
const MASTER_Y = PAD_Y - 10;          // 50

/** Seeded PRNG (mulberry32) — deterministic from a numeric seed */
function seededRng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a string to a numeric seed */
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h;
}

/** Check if (x, y) collides with any placed node */
function hasCollision(x, y, placed, minDist) {
  return placed.some((p) => Math.hypot(p.x - x, p.y - y) < minDist);
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Compute layout positions for a tree's nodes.
 * Mutates each node by setting .x and .y properties.
 *
 * @param {Array} nodes — array of node objects with id, parents[], master?
 * @returns {Array} same nodes array with x, y populated
 */
export function computeLayout(nodes) {
  const count = nodes.length;
  if (count === 0) return nodes;

  // Density-aware collision distance
  const minDist = count <= 5 ? 65 : count <= 10 ? 70 : 45;

  // Build lookup and children map
  const byId = {};
  const childrenOf = {};
  nodes.forEach((n) => {
    byId[n.id] = n;
    childrenOf[n.id] = [];
    n.x = undefined;
    n.y = undefined;
  });
  nodes.forEach((n) => {
    n.parents.forEach((pid) => {
      if (childrenOf[pid]) childrenOf[pid].push(n.id);
    });
  });

  // Identify root (no parents) and terminal master
  const root = nodes.find((n) => n.parents.length === 0);
  const master = nodes.find(
    (n) => n.master && n !== root && childrenOf[n.id].length === 0
  );

  // BFS to compute level (longest path from root)
  const level = {};
  if (root) level[root.id] = 0;
  let changed = true;
  while (changed) {
    changed = false;
    nodes.forEach((n) => {
      if (n === root) return;
      if (n.parents.length === 0) return;
      const parentLevels = n.parents
        .map((p) => level[p])
        .filter((l) => l !== undefined);
      if (parentLevels.length === 0) return;
      const newLevel = Math.max(...parentLevels) + 1;
      if (level[n.id] !== newLevel) {
        level[n.id] = newLevel;
        changed = true;
      }
    });
  }

  // Determine max level (excluding master which gets the top slot)
  let maxLevel = 0;
  nodes.forEach((n) => {
    if (n !== master && level[n.id] !== undefined) {
      maxLevel = Math.max(maxLevel, level[n.id]);
    }
  });

  // Group nodes by level
  const byLevel = {};
  nodes.forEach((n) => {
    if (n === master) return;
    const l = level[n.id];
    if (l === undefined) return;
    if (!byLevel[l]) byLevel[l] = [];
    byLevel[l].push(n);
  });

  // Available vertical range for non-master nodes: ROOT_Y → (MASTER_Y + 90)
  const topBand = MASTER_Y + 90;
  const yRange = ROOT_Y - topBand;
  // If only root + master, keep root at bottom; otherwise distribute across levels
  const levelStep = maxLevel > 0 ? yRange / maxLevel : 0;

  const placed = [];

  // Place nodes level by level
  for (let l = 0; l <= maxLevel; l++) {
    const levelNodes = byLevel[l] || [];
    const y = ROOT_Y - l * levelStep;

    if (levelNodes.length === 1 && l === 0) {
      // Root centered
      const n = levelNodes[0];
      n.x = VIEW_W / 2;
      n.y = Math.round(y);
      placed.push(n);
      continue;
    }

    // Sort by id for stable ordering
    const sorted = [...levelNodes].sort((a, b) => a.id.localeCompare(b.id));

    // Seeded horizontal placement with parent-centroid bias
    sorted.forEach((n, idx) => {
      const rng = seededRng(hashStr(n.id));

      // Start with parent centroid x if available, else distributed across width
      const parentXs = n.parents
        .map((pid) => byId[pid])
        .filter((p) => p && p.x !== undefined)
        .map((p) => p.x);

      let baseX;
      if (parentXs.length > 0) {
        baseX = parentXs.reduce((s, x) => s + x, 0) / parentXs.length;
      } else {
        baseX = VIEW_W / 2;
      }

      // Add seeded jitter (scaled by level count for spread)
      const spread = Math.max(80, VIEW_W / (sorted.length + 1));
      const jitter = (rng() - 0.5) * spread * 1.5;
      let px = clamp(baseX + jitter, PAD_X, VIEW_W - PAD_X);
      let py = Math.round(y + (rng() - 0.5) * 20); // small vertical jitter

      // Collision resolution: nudge horizontally
      let attempts = 0;
      while (hasCollision(px, py, placed, minDist) && attempts < 20) {
        const direction = attempts % 2 === 0 ? 1 : -1;
        px += direction * (minDist * 0.6);
        px = clamp(px, PAD_X, VIEW_W - PAD_X);
        attempts++;
      }

      // If still colliding, try vertical nudge
      attempts = 0;
      while (hasCollision(px, py, placed, minDist) && attempts < 10) {
        py += (attempts % 2 === 0 ? -1 : 1) * 15;
        py = clamp(py, PAD_Y, VIEW_H - PAD_Y);
        attempts++;
      }

      n.x = Math.round(px);
      n.y = Math.round(py);
      placed.push(n);
    });
  }

  // Place master at top-center
  if (master) {
    master.x = VIEW_W / 2;
    master.y = MASTER_Y;
    placed.push(master);
  }

  // Edge case: any unplaced nodes (cycles, disconnected) get random fallback
  nodes.forEach((n) => {
    if (n.x === undefined) {
      const rng = seededRng(hashStr(n.id));
      n.x = clamp(PAD_X + rng() * (VIEW_W - 2 * PAD_X), PAD_X, VIEW_W - PAD_X);
      n.y = clamp(PAD_Y + rng() * (VIEW_H - 2 * PAD_Y), PAD_Y, VIEW_H - PAD_Y);
      placed.push(n);
    }
  });

  return nodes;
}
