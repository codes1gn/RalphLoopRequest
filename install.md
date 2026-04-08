# Durable Request — Installation Guide

This guide is designed to be read and executed by an LLM agent.

## What You're Installing

A single markdown skill file (`skill/SKILL.md`) that teaches any AI agent to present an interactive checkpoint after completing any task, instead of ending silently. No code, no runtime, no dependencies.

## Step 1: Fetch the Skill File

Download the skill file from the repository:

```bash
curl -sL "https://git.enflame.cn/heng.shi/DurableRequest/-/raw/main/skill/SKILL.md" \
  -o /tmp/durable-request-SKILL.md
```

## Step 2: Install to Agent Skill Directories

Copy the skill file into the relevant directories for every platform the user has. Create directories if they don't exist.

Install to **project-level** (current directory) and **personal** (`~`) for each platform:

| Platform | Project path | Personal path |
|----------|-------------|---------------|
| Cursor | `.cursor/skills/durable-request/` | `~/.cursor/skills/durable-request/` |
| Claude Code | `.claude/skills/durable-request/` | `~/.claude/skills/durable-request/` |
| GitHub Copilot | `.github/copilot/skills/durable-request/` | `~/.github/copilot/skills/durable-request/` |
| OpenAI Codex | `.codex/skills/durable-request/` | `~/.codex/skills/durable-request/` |
| Google Gemini CLI | `.gemini/skills/durable-request/` | `~/.gemini/skills/durable-request/` |
| Windsurf | `.windsurf/skills/durable-request/` | `~/.windsurf/skills/durable-request/` |
| Aider | `.aider/skills/durable-request/` | `~/.aider/skills/durable-request/` |
| Cody | `.cody/skills/durable-request/` | `~/.cody/skills/durable-request/` |
| Continue | `.continue/skills/durable-request/` | `~/.continue/skills/durable-request/` |

For each directory in the table above, run:

```bash
mkdir -p <directory> && cp /tmp/durable-request-SKILL.md <directory>/SKILL.md
```

## Step 3: Verify

Confirm the file exists in at least one location:

```bash
ls ~/.cursor/skills/durable-request/SKILL.md 2>/dev/null \
  || ls .cursor/skills/durable-request/SKILL.md 2>/dev/null \
  && echo "Installation verified." || echo "Not found in Cursor paths — check other platform paths."
```

## Step 4: Restart Your Agent Session

The skill is active the next time you start an agent session. No config changes needed.

## Cleanup

```bash
rm -f /tmp/durable-request-SKILL.md
```

## Uninstall

To remove the skill, delete the installed directories:

```bash
rm -rf ~/.cursor/skills/durable-request \
       ~/.claude/skills/durable-request \
       ~/.github/copilot/skills/durable-request \
       .cursor/skills/durable-request \
       .claude/skills/durable-request
# ... repeat for other platforms as needed
```
