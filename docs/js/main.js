/**
 * Application entry point.
 * Imports all modules and bootstraps the portfolio.
 */
import { buildWheel, getCurTree } from "./wheel.js";
import { renderTree } from "./tree-renderer.js";
import { setupEvents } from "./events.js";

// Initialize
buildWheel();
renderTree(getCurTree());
setupEvents();
