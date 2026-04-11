# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.1](https://git.enflame.cn/heng.shi/DurableRequest/compare/v1.0.0...HEAD) - 2026-04-11

### Changed

- **TodoWrite Guardrail**: Added `TodoWrite` as a structural anchor to reinforce checkpoint discipline and improve system stability
- **Conversational Fallback Removed**: Checkpoints now require structured tool calls
- **Single-Question Checkpoint**: Consolidated from 2 questions to 1, with mandatory freeform last option (`custom`)
- **Stress Test CLI** (`harness/checkpoint_cli.py`): Mock testing tool for automated subagent-driven stress testing

### Stress Test Results (3 metrics, 600 total steps)

| Metric | v1 Test (300 steps) | v2 Test (300 steps) |
|--------|:-:|:-:|
| **Checkpoint Completion** | 300/300 (100%) | 300/300 (100%) |
| **Format Correctness** | 299/300 (99.7%) | 300/300 (100%) |
| **Verbose Presence** | not measured | 300/300 (100%) |

- **142 A/B Subagent Experiments**: 100% treatment checkpoint rate, 0% control
- **672 Total Treatment Steps**: 100% checkpoint adherence across all step positions

## [v1.0.0](https://git.enflame.cn/heng.shi/DurableRequest/releases/tag/v1.0.0) - 2026-04-07

### Added

- Initial durable-request skill (`skill/SKILL.md`) with multi-platform support (Cursor, Claude Code, OpenCode)
- Conversational checkpoint fallback with numbered options and freeform input
- A/B test framework with 102 subagent experiments (51 control + 51 treatment)
- Epoch 1 data: 100% treatment continuation rate vs 0% control (Cohen's h = 3.14)
- One-line agent-compatible install command
- Experiment design documentation and raw JSONL results
- MIT license
- Freeform text input option in checkpoint mechanism