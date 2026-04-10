---
tree: devops
type: overview
level: 80
tags:
  - skill-tree
  - devops
---

# DevOps & Release Management

**Level:** 80 · Expert
**Focus:** Release Manager for INT/UAT/PROD environments. Scheduling, governance, change control.

## Nodes
- [[Release Mgmt]] (root)
- [[CI-CD]]
- [[Env Management]]
- [[GitHub Strategy]]
- [[Change Gov]]
- [[QA & Regression]]
- [[Incident Mgmt]]
- [[Auto Deploy]] 🔒
- [[DevOps Master]] 🔒

## Constellation

```mermaid
flowchart TB
  root(["Release Mgmt"]) --> cicd["CI/CD"]
  root --> env["Env Management"]
  cicd --> gh["GitHub Strategy"]
  cicd --> gov["Change Gov"]
  env --> gov
  env --> qa["QA & Regression"]
  gh --> hot["Incident Mgmt"]
  gov --> hot
  gov --> auto["Auto Deploy 🔒"]
  qa --> auto
  hot --> master(["DevOps Master 🔒"])
  auto --> master
```
