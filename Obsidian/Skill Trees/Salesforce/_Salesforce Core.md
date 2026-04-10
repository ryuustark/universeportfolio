---
tree: salesforce
type: overview
level: 90
tags:
  - skill-tree
  - salesforce
---

# Salesforce Core

**Level:** 90 · Expert
**Focus:** 6+ years across full Salesforce stack — dev, admin, Release Management, BAU, Product Owner.

## Nodes
- [[Salesforce]] (root)
- [[Apex]]
- [[Administration]]
- [[SOQL - SOSL]]
- [[Policy Workflows]]
- [[VF & PDF]]
- [[Transact Emails]]
- [[LWC]]
- [[SF Master]] 🔒

## Constellation

```mermaid
flowchart TB
  root(["Salesforce"]) --> apex["Apex"]
  root --> admin["Administration"]
  apex --> soql["SOQL / SOSL"]
  apex --> policy["Policy Workflows"]
  admin --> policy
  admin --> vf["VF & PDF"]
  soql --> email["Transact Emails"]
  policy --> email
  policy --> lwc["LWC"]
  vf --> lwc
  email --> master(["SF Master 🔒"])
  lwc --> master
```
