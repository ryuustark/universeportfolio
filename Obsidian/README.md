---
tags: [meta, index]
---

# Portfolio Obsidian Vault

This vault supports project memory, context, and skill tree planning for the Skyrim-themed portfolio.

## Structure

```
Obsidian/
  Templates/          ← Note templates (Skill Node, Dev Log)
  Skill Trees/        ← One folder per skill category
    Salesforce/
    Integrations/
    DevOps/
    Frontend/
    AI Tools/
    Organization/
    Creative/
  Project/            ← Roadmap, architecture, decisions
  Dev Logs/           ← Daily dev notes
```

## Free-Tier Features Used

- Markdown notes + frontmatter
- `[[Wikilinks]]` for linking (powers graph view + backlinks)
- `#tags` for filtering
- Core plugins: Graph, Backlinks, Templates, Daily Notes, Search, Outline
- Native Mermaid rendering in notes
- No Obsidian Sync, no Publish — local vault only

## Usage

**Add a skill experience:**
1. Create a new note in the relevant `Skill Trees/<Category>/` folder
2. Apply the `Skill Node` template
3. Fill in parents/children with `[[wikilinks]]`
4. The portfolio constellation will render the data dynamically (up to 15 nodes per tree)

**Daily work log:**
- Use Daily Notes (Ctrl+P → "Open today's daily note")
- Applies the `Dev Log` template automatically

**See the big picture:**
- Graph View (Ctrl+G) — visualize all skill connections
- `Documentation/skill_tree_daniel.mmd` — Mermaid overview of all 7 trees

## Conventions

- Filenames match the node label exactly (e.g., `Apex.md`, `VF & PDF.md`)
- Overview notes per tree prefixed with `_` (e.g., `_Salesforce Core.md`) so they sort first
- Tags: `#skill`, `#skill-tree`, `#devlog`, `#project`
