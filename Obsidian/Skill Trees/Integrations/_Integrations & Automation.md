---
tree: integrations
type: overview
level: 75
tags:
  - skill-tree
  - integrations
---

# Integrations & Automation

**Level:** 75 · Expert
**Focus:** REST API integrations connecting Salesforce with external tools across multiple environments.

## Nodes
- [[Integrations]] (root)
- [[REST APIs]]
- [[Flows]]
- [[Batch Jobs]]
- [[API Notifications]]
- [[Salesforce APIs]]
- [[Microservices]]
- [[Middleware]] 🔒
- [[Integ Master]] 🔒

## Constellation

```mermaid
flowchart TB
  root(["Integrations"]) --> rest["REST APIs"]
  root --> flows["Flows"]
  rest --> batch["Batch Jobs"]
  rest --> notif["API Notifications"]
  flows --> notif
  flows --> sfapi["Salesforce APIs"]
  batch --> micro["Microservices"]
  notif --> micro
  notif --> mid["Middleware 🔒"]
  sfapi --> mid
  micro --> master(["Integ Master 🔒"])
  mid --> master
```
