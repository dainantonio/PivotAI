---
name: codex-task-delivery
description: Execute end-to-end repository tasks with a consistent workflow: discover constraints (AGENTS.md/instructions), inspect code, implement focused changes, run targeted validation, summarize with citations, commit with a clear message, and open a pull request. Use when Codex is asked to make code changes that must be delivered production-style with verification and Git/PR handoff.
---

# Codex Task Delivery

## Overview

Follow this workflow to turn a user request into a clean, reviewable repository change with validation evidence and a PR-ready handoff.

## Workflow

1. **Load constraints first**
   - Read instructions in priority order: system/developer/user prompts, then in-scope `AGENTS.md` files.
   - Identify mandatory deliverables (tests, screenshots, commit, PR tool usage, output format).

2. **Scope before editing**
   - Inspect relevant files and confirm where the change belongs.
   - Prefer minimal, focused diffs aligned with existing patterns.

3. **Implement surgically**
   - Modify only files needed for the request.
   - Keep naming, structure, and style consistent with neighboring code.

4. **Validate with executable checks**
   - Run targeted checks first (lint/test/build for impacted areas), then broader checks if needed.
   - Capture exact commands and outcomes for reporting.

5. **Collect proof for UX changes**
   - If the change is visually perceptible in a runnable app, capture a screenshot artifact and reference it in the final response.

6. **Prepare delivery artifacts**
   - Review diff for correctness.
   - Commit with a concise imperative message.
   - Create a PR entry with a title/body that summarize intent, changes, and validation.

7. **Report clearly**
   - Provide a short summary grouped by files changed.
   - Include testing/check commands with pass/warn/fail status.
   - Add file citations for all substantive claims.

## Execution checklist

- Confirm current branch and clean intent before edits.
- Run `git status` and `git diff` before commit.
- Ensure required tools/actions were executed (e.g., commit + PR tool when requested).
- Keep final response concise, verifiable, and citation-backed.
