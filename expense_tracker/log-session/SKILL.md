---
name: log-session
description: Automates session logging to the Obsidian Project Vault ONLY when the user explicitly types /log-session.
---

# Log Session

This skill automates the process of documenting development sessions into your Obsidian vault located at `~/Desktop/Project_Vault`.

## Workflow

1. **Trigger**: This skill ONLY runs when you explicitly type `/log-session`. It must not be triggered automatically by other observations.
   - **Project Name**: The name of the project worked on.
   - **Files Modified**: Files you interacted with.
   - **Actions Taken**: Past-tense active voice bullets (e.g., "Added [[app.js]] to initialize the express server").
   - **Next Steps**: Pending tasks as checkable items.

## Rules for Logging

- **Obsidian Links**: ALWAYS wrap file names and project names in double brackets `[[FileName]]` or `[[ProjectName]]`.
- **Verbs**: Use specific active-voice verbs: `Added`, `Fixed`, `Refactored`, `Removed`, `Decided`, `Discovered`, `Identified`, `Configured`.
- **Bullet Content**: Every action bullet MUST include what was done AND why.
- **Header Structure**:
  - `## [[ProjectName]]`
  - `### HH:MM — Session`
  - `#### Next Steps`

## Execution

Gemini CLI uses a bundled script to handle the file operations:

```bash
node <skill-path>/scripts/log_session.cjs <ProjectName> "Session" '<ActionsJSON>' '<NextStepsJSON>'
```

The script handles:
- Creating `ddmmyyyy.md` with proper frontmatter.
- Appending session blocks under existing project headers or creating new ones.
- Ensuring correct Markdown formatting.
