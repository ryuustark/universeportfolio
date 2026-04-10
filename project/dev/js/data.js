/**
 * Skill tree data model.
 * Each tree has: title, level, nodes[].
 * Node positions (x, y) are computed dynamically by layout.js — not stored here.
 */
export const trees = {
  salesforce: {
    title: "Salesforce Core", level: 90, nodes: [
      { id: "root",   label: "Salesforce",       size: 18, master: true,  unlocked: true,  desc: "6+ years across full Salesforce stack: dev, admin, Release Management, BAU, Product Owner.", rank: "Expert · Level 90", parents: [] },
      { id: "apex",   label: "Apex",             size: 14,                unlocked: true,  desc: "Triggers, Batch, Async (Queueable/Schedulable). Large-scale policy renewals and payment processing.", rank: "Expert · Apex Dev", parents: ["root"] },
      { id: "admin",  label: "Administration",   size: 14,                unlocked: true,  desc: "Custom objects, layouts, validation rules, Sales Cloud configuration.", rank: "Expert · Admin", parents: ["root"] },
      { id: "soql",   label: "SOQL / SOSL",      size: 12,                unlocked: true,  desc: "Complex queries, cross-object, optimization for large datasets.", rank: "Expert · Query", parents: ["apex"] },
      { id: "policy", label: "Policy Workflows", size: 12,                unlocked: true,  desc: "Multi-country insurance policy sales workflows outside standard Sales flow. End-to-end ownership.", rank: "Expert · Custom Flow", parents: ["apex", "admin"] },
      { id: "vf_pdf", label: "VF & PDF",         size: 12,                unlocked: true,  desc: "Multiple Visualforce PDF certificate templates — reduced legacy tool dependency ~80%.", rank: "Expert · Visualforce", parents: ["admin"] },
      { id: "email",  label: "Transact Emails",  size: 13,                unlocked: true,  desc: "Dynamic transactional emails with Visualforce templates.", rank: "Expert · Comms", parents: ["soql", "policy"] },
      { id: "lwc",    label: "LWC",              size: 13,                unlocked: true,  desc: "Custom Lightning Web Components to display complex data and trigger Apex-driven business processes.", rank: "Expert · LWC", parents: ["policy", "vf_pdf"] },
      { id: "master", label: "SF Master",        size: 18, master: true,  unlocked: false, desc: "Complete Salesforce mastery. Admin Cert renewal + B2B Commerce expansion next.", rank: "Master · Salesforce", parents: ["email", "lwc"] },
    ]
  },
  integrations: {
    title: "Integrations & Automation", level: 75, nodes: [
      { id: "root",      label: "Integrations",      size: 18, master: true,  unlocked: true,  desc: "Designed and maintained multiple REST API integrations connecting Salesforce with external tools.", rank: "Expert · Level 75", parents: [] },
      { id: "rest",      label: "REST APIs",         size: 14,                unlocked: true,  desc: "Multi-env REST API design, iterative maintenance aligned to business and environment evolution.", rank: "Expert · REST", parents: ["root"] },
      { id: "flows",     label: "Flows",             size: 14,                unlocked: true,  desc: "Automated flows with conditional logic and time-based delays, executing via Apex classes.", rank: "Expert · Flows", parents: ["root"] },
      { id: "batch",     label: "Batch Jobs",        size: 12,                unlocked: true,  desc: "Scheduled and on-demand Apex Batch for renewals, monthly payment processing, recurring ops.", rank: "Expert · Batch", parents: ["rest"] },
      { id: "api_notif", label: "API Notifications", size: 12,                unlocked: true,  desc: "Flow-triggered API notifications with conditional + time-delay logic via Apex.", rank: "Expert · Events", parents: ["rest", "flows"] },
      { id: "sf_apis",   label: "Salesforce APIs",   size: 12,                unlocked: true,  desc: "Bulk API, Streaming API, REST API — internal and external integration patterns.", rank: "Expert · SF APIs", parents: ["flows"] },
      { id: "micro",     label: "Microservices",     size: 13,                unlocked: true,  desc: "BAU Salesforce touchpoint within a large microservice architecture. Solution design and governance.", rank: "Advanced · Micro", parents: ["batch", "api_notif"] },
      { id: "middleware", label: "Middleware",        size: 13,                unlocked: false, desc: "Deeper middleware ownership. Currently at integration-point level — full authorship next.", rank: "Learning · Middleware", parents: ["api_notif", "sf_apis"] },
      { id: "master",    label: "Integ Master",      size: 18, master: true,  unlocked: false, desc: "Full integration architect: design patterns, event-driven, middleware ownership.", rank: "Master · Integrations", parents: ["micro", "middleware"] },
    ]
  },
  devops: {
    title: "DevOps & Release Mgmt", level: 80, nodes: [
      { id: "root",       label: "Release Mgmt",    size: 18, master: true,  unlocked: true,  desc: "Release Manager for INT/UAT/PROD environments. Scheduling, governance, change control.", rank: "Expert · Level 80", parents: [] },
      { id: "cicd",       label: "CI/CD",           size: 14,                unlocked: true,  desc: "Automated pipelines, GitHub branching strategies, deployment automation.", rank: "Expert · CI/CD", parents: ["root"] },
      { id: "env_mgmt",   label: "Env Management",  size: 14,                unlocked: true,  desc: "INT / UAT / PROD environment lifecycle. Coordination across teams and stakeholders.", rank: "Expert · Environments", parents: ["root"] },
      { id: "github",     label: "GitHub Strategy",  size: 12,                unlocked: true,  desc: "Branching strategies, PR workflows, version control discipline at scale.", rank: "Expert · Git", parents: ["cicd"] },
      { id: "governance", label: "Change Gov",       size: 12,                unlocked: true,  desc: "Approval flows, risk assessment, rollback planning, change documentation.", rank: "Expert · Governance", parents: ["cicd", "env_mgmt"] },
      { id: "qa",         label: "QA & Regression",  size: 12,                unlocked: true,  desc: "Unit tests, regression validation, code reviews, deployment testing.", rank: "Expert · QA", parents: ["env_mgmt"] },
      { id: "hotfix",     label: "Incident Mgmt",    size: 13,                unlocked: true,  desc: "Deployment failure resolution, hotfixes under pressure, rapid root cause analysis.", rank: "Expert · Incident", parents: ["github", "governance"] },
      { id: "auto_d",     label: "Auto Deploy",      size: 13,                unlocked: false, desc: "Full deploy automation — scripted pipelines, zero-touch releases.", rank: "Advanced · Auto", parents: ["governance", "qa"] },
      { id: "master",     label: "DevOps Master",    size: 18, master: true,  unlocked: false, desc: "Complete DevOps maturity: platform engineering, automated governance.", rank: "Master · DevOps", parents: ["hotfix", "auto_d"] },
    ]
  },
  frontend: {
    title: "UI / Front-End", level: 65, nodes: [
      { id: "root",       label: "Front-End",       size: 18, master: true,  unlocked: true,  desc: "HTML/CSS/JS across all LWC and Visualforce work. Portfolio built with vanilla stack.", rank: "Advanced · Level 65", parents: [] },
      { id: "vf",         label: "Visualforce",     size: 14,                unlocked: true,  desc: "Multiple PDF certificate templates, email templates. Migration of deprecated pages.", rank: "Expert · Visualforce", parents: ["root"] },
      { id: "lwc",        label: "LWC / Lightning", size: 14,                unlocked: true,  desc: "Custom UI components, action buttons, complex data display, Apex integration calls.", rank: "Expert · LWC", parents: ["root"] },
      { id: "html_css",   label: "HTML / CSS",      size: 12,                unlocked: true,  desc: "Front-end structure and styling for certs, transactional emails, portfolio pages.", rank: "Advanced · HTML/CSS", parents: ["vf"] },
      { id: "js",         label: "JavaScript",      size: 12,                unlocked: true,  desc: "Client-side logic, Apex integration calls, component interactivity.", rank: "Advanced · JS", parents: ["vf", "lwc"] },
      { id: "portfolio",  label: "Portfolio Dev",   size: 12,                unlocked: true,  desc: "Universe Portfolio — vanilla HTML/CSS/JS, dark gothic aesthetic, RPG skill wheel.", rank: "Advanced · Portfolio", parents: ["lwc"] },
      { id: "components", label: "Component Arch",  size: 13,                unlocked: true,  desc: "Reusable Lightning components driving business processes through Apex-driven actions.", rank: "Advanced · Components", parents: ["html_css", "js"] },
      { id: "frameworks", label: "JS Frameworks",   size: 13,                unlocked: false, desc: "Next evolution: React or Vue for portfolio and internal tools beyond vanilla stack.", rank: "Learning · Frameworks", parents: ["js", "portfolio"] },
      { id: "master",     label: "UI Master",       size: 18, master: true,  unlocked: false, desc: "Full-stack front-end: modern frameworks, design systems, accessible UIs.", rank: "Master · Front-End", parents: ["components", "frameworks"] },
    ]
  },
  ai_tools: {
    title: "AI & Dev Tools", level: 40, nodes: [
      { id: "root",       label: "AI & Tools",       size: 18, master: true,  unlocked: true,  desc: "Certified in Claude Code and AI Fluency. Active use of AI to accelerate dev while maintaining code independence.", rank: "Certified · Level 40", parents: [] },
      { id: "claude",     label: "Claude Code",      size: 14,                unlocked: true,  desc: "Anthropic certified. Integrated into dev workflows for code generation, review, and architecture planning.", rank: "Expert · Claude Code", parents: ["root"] },
      { id: "copilot",    label: "GitHub Copilot",   size: 14,                unlocked: true,  desc: "AI-assisted development workflows. Maintains code resilience and independence patterns.", rank: "Advanced · Copilot", parents: ["root"] },
      { id: "prompt",     label: "Prompt Eng",       size: 12,                unlocked: true,  desc: "Effective prompting strategies for dev acceleration, code review, documentation.", rank: "Advanced · Prompting", parents: ["claude"] },
      { id: "workflow",   label: "AI Workflows",     size: 12,                unlocked: true,  desc: "AI-integrated dev pipelines — code generation, testing support, documentation automation.", rank: "Advanced · Workflow", parents: ["claude", "copilot"] },
      { id: "ethics",     label: "AI Ethics",        size: 12,                unlocked: true,  desc: "Anthropic AI Fluency certified: framework, foundations, ethics, safety principles.", rank: "Certified · Ethics", parents: ["copilot"] },
      { id: "resilience", label: "Code Resilience",  size: 13,                unlocked: true,  desc: "Anti-fragile patterns — AI accelerates without creating AI-dependency in the codebase.", rank: "Advanced · Resilience", parents: ["prompt", "workflow"] },
      { id: "llm_dev",    label: "LLM Dev",          size: 13,                unlocked: false, desc: "Building applications with LLM APIs. Agentic workflows and AI-powered tooling next.", rank: "Learning · LLM Dev", parents: ["workflow", "ethics"] },
      { id: "master",     label: "AI Expert",        size: 18, master: true,  unlocked: false, desc: "Full AI architect: LLM integration, agentic systems, responsible AI at scale.", rank: "Master · AI", parents: ["resilience", "llm_dev"] },
    ]
  },
  organization: {
    title: "Organization & Agile", level: 70, nodes: [
      { id: "root",      label: "Organization",   size: 18, master: true,  unlocked: true,  desc: "End-to-end project ownership: requirement gathering to production release, multi-country teams.", rank: "Expert · Level 70", parents: [] },
      { id: "agile",     label: "Agile / Scrum",  size: 14,                unlocked: true,  desc: "Sprint management, cross-team coordination, stakeholder updates across multiple countries.", rank: "Expert · Agile", parents: ["root"] },
      { id: "notion",    label: "Notion Systems", size: 14,                unlocked: true,  desc: "Notion Essentials + Workflows certified. Databases, views, automation, dashboards.", rank: "Expert · Notion", parents: ["root"] },
      { id: "sprints",   label: "Sprint Mgmt",    size: 12,                unlocked: true,  desc: "Led sprints through migration, BAU, and feature delivery cycles. Multi-timezone environments.", rank: "Expert · Sprints", parents: ["agile"] },
      { id: "po",        label: "Product Owner",  size: 12,                unlocked: true,  desc: "Client comms, business analysis, feature definition, backlog management.", rank: "Advanced · PO", parents: ["agile", "notion"] },
      { id: "db_design", label: "DB Design",      size: 12,                unlocked: true,  desc: "Notion database relations, views, filtering. Parallel to Salesforce data modelling.", rank: "Expert · DB Design", parents: ["notion"] },
      { id: "tech_debt", label: "Tech Debt",      size: 13,                unlocked: true,  desc: "Proactive tools and processes built to reduce technical debt day-to-day.", rank: "Advanced · Debt Mgmt", parents: ["sprints", "po"] },
      { id: "dashboards", label: "Dashboards",    size: 13,                unlocked: false, desc: "Advanced Notion dashboards and reporting systems for team-level visibility.", rank: "Learning · Dashboards", parents: ["po", "db_design"] },
      { id: "master",    label: "Org Master",     size: 18, master: true,  unlocked: false, desc: "Complete organizational mastery: leadership, scaled planning, process architecture.", rank: "Master · Organization", parents: ["tech_debt", "dashboards"] },
    ]
  },
  creative: {
    title: "Creative & 3D", level: 35, nodes: [
      { id: "root",    label: "Creative",        size: 18, master: true,  unlocked: true,  desc: "3D printing, miniature painting, and portfolio design under the Runar Studio / Runar Forge brand.", rank: "Advanced · Level 35", parents: [] },
      { id: "fdm",     label: "FDM Printing",    size: 14,                unlocked: true,  desc: "FDM 3D printing with PLA/ABS/TPU. Printer management, calibration, material selection.", rank: "Advanced · FDM", parents: ["root"] },
      { id: "minis",   label: "Miniature Paint",  size: 14,                unlocked: true,  desc: "Trench Crusade and Fantasy Miniatures. Detailing, basing, lore-driven presentation.", rank: "Advanced · Minis", parents: ["root"] },
      { id: "slicing", label: "Slicing",          size: 12,                unlocked: true,  desc: "Slicing optimization and support structure design for reliable prints.", rank: "Advanced · Slicing", parents: ["fdm"] },
      { id: "trench",  label: "Trench Crusade",   size: 12,                unlocked: true,  desc: "Trench Crusade miniatures — niche dark-fantasy tabletop system.", rank: "Advanced · TrenchCrusade", parents: ["fdm", "minis"] },
      { id: "fantasy", label: "Fantasy Minis",    size: 12,                unlocked: true,  desc: "Fantasy miniature painting — character pieces, layering, washes.", rank: "Advanced · Fantasy", parents: ["minis"] },
      { id: "resin",   label: "Resin Print",      size: 13,                unlocked: false, desc: "Resin 3D printing — high detail, fragile post-processing. Next hardware expansion.", rank: "Learning · Resin", parents: ["slicing", "trench"] },
      { id: "brand",   label: "Runar Studio",     size: 13,                unlocked: true,  desc: "Universe Portfolio — dark gothic aesthetic, Cinzel typography, RPG-inspired skill wheel.", rank: "Advanced · Branding", parents: ["trench", "fantasy"] },
      { id: "master",  label: "Creative Master",  size: 18, master: true,  unlocked: false, desc: "Full creative studio: print farm, display pieces, documented process content.", rank: "Master · Creative", parents: ["resin", "brand"] },
    ]
  }
};

export const WHEEL_ITEMS = [
  { key: "salesforce",   label: "Salesforce",   level: 90 },
  { key: "integrations", label: "Integrations", level: 75 },
  { key: "devops",       label: "DevOps",       level: 80 },
  { key: "frontend",     label: "Front-End",    level: 65 },
  { key: "ai_tools",     label: "AI & Tools",   level: 40 },
  { key: "organization", label: "Organization", level: 70 },
  { key: "creative",     label: "Creative",     level: 35 },
];
