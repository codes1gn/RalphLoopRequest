# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.1] - 2026-04-11

### Added
- **Cursor Agent support**: Full `AskQuestion` integration for Cursor parent agent sessions, enabling true durable loops (block turn, not end request)
- **TodoWrite reinforcement**: `TodoWrite` + `AskQuestion` double-lock pattern prevents silent completions even when `AskQuestion` is unavailable
- **Verbose fallback**: Agents explicitly state when `AskQuestion` is unavailable and why, before falling back to conversational checkpoint
- **Environment detection table**: Agents can distinguish parent agent vs subagent vs CLI context
- **Checkpoint harness CLI** (`harness/checkpoint_harness.py`): Automated testing tool for subagent-driven checkpoint verification
- **AI-readable readout** (`data/READOUT.md`): Comprehensive structured summary of all experiments and findings
- **Epoch 2 A/B test data** (`data/epoch-2026-04-11/`): 40 subagent experiments (20 control + 20 treatment) across 3 scenarios
- **Long-run stability tests**: 5, 7, 10, 50, and 300-step consecutive checkpoint tests — all at 100% checkpoint rate
- **300-step stress test**: 6 parallel subagents × 50 steps each, 300/300 checkpoints with zero omissions

### Changed
- `skill/SKILL.md`: Rewritten with Cursor-specific mechanics, TodoWrite reinforcement, verbose fallback, and anti-rationalization rules
- `README.md`: Updated with Cursor agent architecture diagram, epoch-based results, and 372-step long-run data

### Fixed
- `AskQuestion` schema aligned with actual Cursor agent tool parameters (`allow_multiple: false`)
- "Ralph Loop Request" naming inconsistency renamed to "durable-request" throughout
- Subagent vs parent agent behavior explicitly documented to prevent `AskQuestion` calls in subagent context

## [v1.0.0] - 2026-04-07

### Added
- Initial durable-request skill (`skill/SKILL.md`) with multi-platform support (Cursor, Claude Code, OpenCode)
- Conversational checkpoint fallback with numbered options and freeform input
- A/B test framework with 102 subagent experiments (51 control + 51 treatment)
- Epoch 1 data: 100% treatment continuation rate vs 0% control (Cohen's h = 3.14)
- One-line agent-compatible install command
- Experiment design documentation and raw JSONL results
- MIT license
- Freeform text input option in checkpoint mechanism

[v1.0.1]: https://git.enflame.cn/heng.shi/DurableRequest/compare/v1.0.0...HEAD
[v1.0.0]: https://git.enflame.cn/heng.shi/DurableRequest/releases/tag/v1.0.0
