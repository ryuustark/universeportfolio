---
tree: frontend
type: overview
level: 65
tags:
  - skill-tree
  - frontend
---

# UI / Front-End

**Level:** 65 · Advanced
**Focus:** HTML/CSS/JS across LWC and Visualforce. Portfolio built with vanilla stack.

## Nodes
- [[Front-End]] (root)
- [[Visualforce]]
- [[LWC - Lightning]]
- [[HTML - CSS]]
- [[JavaScript]]
- [[Portfolio Dev]]
- [[Component Arch]]
- [[JS Frameworks]] 🔒
- [[UI Master]] 🔒

## Constellation

```mermaid
flowchart TB
  root(["Front-End"]) --> vf["Visualforce"]
  root --> lwc["LWC / Lightning"]
  vf --> html["HTML / CSS"]
  vf --> js["JavaScript"]
  lwc --> js
  lwc --> port["Portfolio Dev"]
  html --> comp["Component Arch"]
  js --> comp
  js --> fw["JS Frameworks 🔒"]
  port --> fw
  comp --> master(["UI Master 🔒"])
  fw --> master
```
