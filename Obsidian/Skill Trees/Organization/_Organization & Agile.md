---
tree: organization
type: overview
level: 70
tags:
  - skill-tree
  - organization
---

# Organization & Agile

**Level:** 70 · Expert
**Focus:** End-to-end project ownership — requirement gathering to production release across multi-country teams.

## Nodes
- [[Organization]] (root)
- [[Agile - Scrum]]
- [[Notion Systems]]
- [[Sprint Mgmt]]
- [[Product Owner]]
- [[DB Design]]
- [[Tech Debt]]
- [[Dashboards]] 🔒
- [[Org Master]] 🔒

## Constellation

```mermaid
flowchart TB
  root(["Organization"]) --> agile["Agile / Scrum"]
  root --> notion["Notion Systems"]
  agile --> sprint["Sprint Mgmt"]
  agile --> po["Product Owner"]
  notion --> po
  notion --> db["DB Design"]
  sprint --> debt["Tech Debt"]
  po --> debt
  po --> dash["Dashboards 🔒"]
  db --> dash
  debt --> master(["Org Master 🔒"])
  dash --> master
```
