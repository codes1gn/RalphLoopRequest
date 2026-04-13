# Durable Request — Installation Guide

This guide is designed to be read and executed by an LLM agent.

## What You're Installing

Two components:

1. **Skill file** (`skill/SKILL.md`) — teaches any AI agent to present an interactive checkpoint after completing any task. Works on all platforms. No runtime, no dependencies.
2. **CLI checkpoint tool** (`skill/checkpoint.sh` + `skill/checkpoint-ui.sh`, Cursor CLI only) — enables true blocking interactive checkpoints in Cursor CLI via tmux split panes. Optional for other platforms.

## Step 1: Clone the Repository

Clone the repo via SSH (requires a git.enflame.cn account with SSH key configured):

```bash
git clone git@git.enflame.cn:skills/durablerequest.git /tmp/durable-request-repo
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
mkdir -p <directory> && cp /tmp/durable-request-repo/skill/SKILL.md <directory>/SKILL.md
```

## Step 3: Install CLI Checkpoint Tool (Cursor CLI only)

This step is **only for Cursor CLI** users. Skip for other platforms.

The CLI checkpoint tool enables true blocking interactive checkpoints in Cursor CLI via tmux split panes.

### 3a: Copy checkpoint scripts from the cloned repo

```bash
cp /tmp/durable-request-repo/skill/checkpoint.sh ~/.cursor/skills/durable-request/checkpoint.sh
cp /tmp/durable-request-repo/skill/checkpoint-ui.sh ~/.cursor/skills/durable-request/checkpoint-ui.sh
chmod +x ~/.cursor/skills/durable-request/checkpoint.sh
chmod +x ~/.cursor/skills/durable-request/checkpoint-ui.sh
```

### 3b: Set up tmux + locale (required for Cursor CLI)

Add these to `~/.bashrc`:

```bash
cat >> ~/.bashrc << 'BASHEOF'
# UTF-8 locale for proper terminal rendering
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Run cursor-agent inside tmux for interactive checkpoints
alias cursor-agent='tmux new-session -A -s cursor -- cursor-agent'
BASHEOF
source ~/.bashrc
```

Set the tmux terminal type for proper Unicode support:

```bash
cat >> ~/.tmux.conf << 'TMUXEOF'
set -g default-terminal "tmux-256color"
set -gq utf8 on
TMUXEOF
```

If tmux is already running, kill it so it picks up the new config: `tmux kill-server`

### 3c: Verify checkpoint scripts

```bash
ls -la ~/.cursor/skills/durable-request/checkpoint*.sh
```

## Step 4: Verify

Confirm the file exists in at least one location:

```bash
ls ~/.cursor/skills/durable-request/SKILL.md 2>/dev/null \
  || ls .cursor/skills/durable-request/SKILL.md 2>/dev/null \
  && echo "Installation verified." || echo "Not found in Cursor paths — check other platform paths."
```

Confirm the CLI checkpoint tool is installed (Cursor CLI only):

```bash
ls ~/.cursor/skills/durable-request/checkpoint.sh 2>/dev/null \
  && echo "CLI checkpoint tool verified." \
  || echo "CLI checkpoint not installed (optional, Cursor CLI only)."
```

## Step 5: Restart Your Agent Session

The skill is active the next time you start an agent session. No config changes needed. The CLI checkpoint tool is picked up automatically.

## Cleanup

```bash
rm -rf /tmp/durable-request-repo
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
