# Changelog

All notable changes to durable-request are documented here.

## [1.1.0] - 2026-04-12

### Added
- **Cursor CLI checkpoint tool** (`checkpoint.sh` + `checkpoint-ui.sh`) — true blocking interactive checkpoints in Cursor CLI via tmux split panes. The Shell tool call blocks while the user selects their next action in a split pane, achieving the same durable loop behavior as `AskQuestion` in the editor.
- Three-layer checkpoint architecture: AskQuestion (editor) → checkpoint.sh (CLI) → conversational fallback (subagents)
- Tmux alias for cursor-agent: `alias cursor-agent='tmux new-session -A -s cursor -- cursor-agent'`
- Preserved failed stop-hook attempt in `patches/` for reference

### Changed
- SKILL.md: priority-ordered environment detection table, CLI-specific success handler, tmux diagram
- README.md: updated platform behavior table with "Blocking?" column, new CLI architecture diagram
- install.md: added Step 3 for CLI checkpoint tool + tmux/locale setup

### Fixed
- `set -e` in checkpoint.sh caused silent exit when tmux was unavailable (now gracefully falls back)
- Terminal rendering (VT100 ACS fallback) when LANG/locale not set to UTF-8

### Technical Notes
- Cursor CLI Shell tool runs in sandbox — no `/dev/tty` access, but CAN access tmux via `tmux split-window`
- File-based IPC: checkpoint.sh writes question, checkpoint-ui.sh writes answer, polling loop bridges them
- Keep-alive messages every 10s prevent Shell tool timeout during long user response times

## [1.0.1] - 2026-04-11

### Added
- Epoch 3 A/B experiments (30 control + 30 treatment subagents)
- Product website with animated feature demos
- LAN serving script (`serve.sh`) + systemd service file

## [1.0.0] - 2026-04-10

### Added
- Initial release of durable-request skill
- AskQuestion integration for Cursor editor
- AskUserQuestion integration for Claude Code
- `question` tool integration for OpenCode
- Conversational fallback for all platforms
- TodoWrite + AskQuestion reinforcement pattern
- A/B experiment harness with 170 total subagent experiments across 3 epochs
