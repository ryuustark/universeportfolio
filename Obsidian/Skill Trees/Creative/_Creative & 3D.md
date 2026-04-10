---
tree: creative
type: overview
level: 35
tags:
  - skill-tree
  - creative
---

# Creative & 3D

**Level:** 35 · Advanced
**Focus:** 3D printing, miniature painting, and portfolio design under the Runar Studio / Runar Forge brand.

## Nodes
- [[Creative]] (root)
- [[FDM Printing]]
- [[Miniature Paint]]
- [[Slicing]]
- [[Trench Crusade]]
- [[Fantasy Minis]]
- [[Resin Print]] 🔒
- [[Runar Studio]]
- [[Creative Master]] 🔒

## Constellation

```mermaid
flowchart TB
  root(["Creative"]) --> fdm["FDM Printing"]
  root --> mini["Miniature Paint"]
  fdm --> slice["Slicing"]
  fdm --> trench["Trench Crusade"]
  mini --> trench
  mini --> fan["Fantasy Minis"]
  slice --> resin["Resin Print 🔒"]
  trench --> resin
  trench --> brand["Runar Studio"]
  fan --> brand
  resin --> master(["Creative Master 🔒"])
  brand --> master
```
