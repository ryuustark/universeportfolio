---
tree: ai_tools
type: overview
level: 40
tags:
  - skill-tree
  - ai_tools
---

# AI & Dev Tools

**Level:** 40 · Certified
**Focus:** Claude Code + AI Fluency certified. AI accelerates dev while maintaining code independence.

## Nodes
- [[AI & Tools]] (root)
- [[Claude Code]]
- [[GitHub Copilot]]
- [[Prompt Eng]]
- [[AI Workflows]]
- [[AI Ethics]]
- [[Code Resilience]]
- [[LLM Dev]] 🔒
- [[AI Expert]] 🔒

## Constellation

```mermaid
flowchart TB
  root(["AI & Tools"]) --> claude["Claude Code"]
  root --> copilot["GitHub Copilot"]
  claude --> prompt["Prompt Eng"]
  claude --> wf["AI Workflows"]
  copilot --> wf
  copilot --> eth["AI Ethics"]
  prompt --> res["Code Resilience"]
  wf --> res
  wf --> llm["LLM Dev 🔒"]
  eth --> llm
  res --> master(["AI Expert 🔒"])
  llm --> master
```
