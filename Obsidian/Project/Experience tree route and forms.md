---
tags:
  - project
  - planning
---

# Experience Tree — Route & Forms

This page will create the flow of the experience that will be shown in the page. Each constellation should be easily configured or modified in case I want to add more similar information.

## Goal
Multi-stage exploration navigation driven by data in `Obsidian/Skill Trees/` + `project/dev/js/data.js`.

**Flow:** Skill wheel → Constellation (dynamic) → Experience detail card

## Stage 1 — Skill Wheel (done)
7 skill categories rendered as a 3D rotating carousel.

## Stage 2 — Dynamic Constellation (done)
Nodes auto-positioned by `layout.js` using seeded radial growth. Up to 15 nodes per tree. No hardcoded coordinates — just add more entries to `data.js` or notes in `Skill Trees/<category>/`.

## Stage 3 — Experience Card (future)
Each node opens a detail card with:
- Quantified impact (metrics, % reduction, time saved)
- Timeline & team size
- Technologies used
- Links to artifacts, demos, commits
