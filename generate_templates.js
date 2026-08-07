const fs = require('fs');
const path = require('path');

const templatesDir = 'D:/Software/Obsidian Vault/NameForge Knowledge Base/000_System/Templates';

const templates = {
  'ADR_Template.md': \---
type: adr
id: ADR-<% tp.file.cursor(1) %>
title: "<% tp.file.title %>"
status: proposed
date_decided: <% tp.file.creation_date("YYYY-MM-DD") %>
impacts: []
---
# <% tp.file.title %>

## Context
<% tp.file.cursor(2) %>

## Decision
## Consequences\,

  'Product_Decision_Template.md': \---
type: product-decision
id: PD-<% tp.file.cursor(1) %>
title: "<% tp.file.title %>"
status: active
date: <% tp.file.creation_date("YYYY-MM-DD") %>
---
# <% tp.file.title %>

## The Problem
<% tp.file.cursor(2) %>

## The Decision
## Why Not X?\,

  'Research_Template.md': \---
type: research
domain: 
date: <% tp.file.creation_date("YYYY-MM-DD") %>
---
# <% tp.file.title %>

## Hypothesis / Goal
<% tp.file.cursor(1) %>

## Findings
## Actionable Insights\,

  'Meeting_Template.md': \---
type: meeting
date: <% tp.file.creation_date("YYYY-MM-DD") %>
attendees: []
---
# <% tp.file.title %>

## Context
<% tp.file.cursor(1) %>

## Action Items
- [ ] 

## Notes\,

  'Bug_Template.md': \---
type: bug
severity: 
status: open
product: 
date_logged: <% tp.file.creation_date("YYYY-MM-DD") %>
---
# <% tp.file.title %>

## Description
<% tp.file.cursor(1) %>

## Steps to Reproduce
## Expected vs Actual\,

  'Daily_Note_Template.md': \---
type: daily
date: <% tp.file.title %>
---
# <% tp.file.title %>

## Action Items Created Today
\\\	asks
created on <% tp.file.title %>
\\\

## Scratchpad
<% tp.file.cursor(1) %>\,

  'Weekly_Review_Template.md': \---
type: weekly
week: <% tp.file.title %>
---
# Week <% tp.file.title %> Review

## Accomplished
## Open Items (Rollover)
<% tp.file.cursor(1) %>\,
  
  'Knowledge_Package_Template.md': \---
type: knowledge-package
name: <% tp.file.title %>
version: 1.0.0
source_url: 
last_compiled: <% tp.file.creation_date("YYYY-MM-DD") %>
---
# <% tp.file.title %>

## Origin
<% tp.file.cursor(1) %>

## Merge Rules
## Output Features\,

  'Dataset_Template.md': \---
type: dataset
version: <% tp.file.title %>
status: active
release_date: <% tp.file.creation_date("YYYY-MM-DD") %>
---
# LexForge Dataset <% tp.file.title %>

## Included Packages
<% tp.file.cursor(1) %>

## Statistics
## Breaking Changes\
};

Object.keys(templates).forEach(filename => {
  fs.writeFileSync(path.join(templatesDir, filename), templates[filename]);
});
