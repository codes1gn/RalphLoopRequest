# Cursor CLI Stop Hook Attempt — Failure Summary

**Date:** 2026-04-11
**Objective:** Add deterministic agent continuation to Cursor CLI via the `stop` hook's `followup_message` output.
**Result:** Failed. The hook mechanism does not work in Cursor Agent CLI.

## What was attempted

### Approach: Three-layer checkpoint architecture

1. **Layer 1 (new, deterministic):** A `.cursor/hooks.json` `stop` hook that runs a bash script (`durable-request-stop.sh`) when the agent completes. The script outputs `{"followup_message": "..."}` to auto-continue the agent loop.
2. **Layer 2 (existing):** `AskQuestion` tool — blocks the agent turn, shows UI widget. Already works in Cursor editor.
3. **Layer 3 (existing):** Conversational fallback — numbered text options. Already works everywhere.

The idea was that Layer 1 would provide a safety net: even if the agent forgot to present a checkpoint (Layers 2/3), the hook would catch the `stop` event and auto-continue.

### Files created/modified

- `.cursor/hooks/durable-request-stop.sh` — the hook script
- `.cursor/hooks.json` — hook registration
- `skill/SKILL.md` — updated with three-layer architecture, CLI environment detection, CLI-formatted fallback
- `install.md` — added Step 3 for hook installation
- `README.md` — updated diagrams, platform table, repo structure
- `.gitignore` — whitelisted hook files

### Testing results

The hook script itself works correctly in isolation — all 7 test cases pass:

| Test | Input | Expected | Actual |
|------|-------|----------|--------|
| completed, loop 0 | `{"status":"completed","loop_count":0}` | followup_message | followup_message |
| completed, loop 3 | `{"status":"completed","loop_count":3}` | followup_message | followup_message |
| completed, loop 4 (max) | `{"status":"completed","loop_count":4}` | `{}` | `{}` |
| aborted | `{"status":"aborted","loop_count":0}` | `{}` | `{}` |
| error | `{"status":"error","loop_count":0}` | `{}` | `{}` |
| DONE in scratchpad | scratchpad contains "DONE" | `{}` | `{}` |
| NO_FOLLOWUP in state file | state file contains "NO_FOLLOWUP" | `{}` | `{}` |

## Why it failed

After deploying the hook to both project (`.cursor/`) and global (`~/.cursor/`) levels, the agent session in Cursor CLI **still terminated normally** at the end of the turn. The `followup_message` was never acted upon.

### Probable causes (ranked by likelihood)

1. **Cursor CLI does not support the `stop` hook at all.** The hooks system may be editor-only (VS Code extension context). The CLI agent (`cursor-agent`) may run a different harness that doesn't invoke lifecycle hooks.

2. **Cursor CLI runs the hook but ignores `followup_message`.** The `followup_message` field in `StopOutput` may only be respected in the editor's agent loop, not the CLI's.

3. **Hook path resolution differs in CLI.** The CLI may not resolve `.cursor/hooks.json` relative to the workspace the same way the editor does.

4. **The hook ran but timing was wrong.** If the hook runs *after* the session is already torn down (asynchronously), the followup has nowhere to go.

### Evidence

- The hook script is correct (verified by piping test JSON to stdin).
- The hook files were in place at both project and global scope.
- The agent session ended cleanly without any auto-continuation between the previous turn and this one. The user explicitly reported "你这次断开了啊" (you disconnected this time), confirming no followup was injected.

## What was preserved

- **Patch file:** `patches/cursor-cli-hook-attempt.patch` (486 lines) contains the full diff of all changes, including untracked hook files.
- **Stash:** `git stash@{0}` contains the tracked file modifications.
- **To restore:** `git stash pop` to restore tracked changes, then `git apply patches/cursor-cli-hook-attempt.patch` for the full set.

## Lessons learned

1. **Web search and third-party documentation about Cursor hooks are unreliable for CLI.** The `followup_message` / `loop_count` / `Continue()` / `Followup()` API is documented by third parties (hookshot, blog posts) but actual Cursor CLI support is unverified.

2. **The hooks system was announced as "beta" (Cursor 1.7).** Beta features in the editor don't necessarily ship to the CLI.

3. **Cursor's own best-practices blog shows a `stop` hook with `followup_message` + `loop_count`**, but the example is framed as a Cursor editor feature, not CLI.

4. **The skill-only approach (Layers 2+3) remains the correct path for CLI.** The conversational fallback works reliably in CLI — the agent presents numbered options, the user responds, the agent continues. No external mechanism needed.

## Recommendation

Do not pursue the `stop` hook approach for Cursor CLI until Cursor officially documents CLI hook support. The existing SKILL.md with conversational fallback is the correct mechanism for CLI environments. If Cursor adds CLI hook support in the future, the patch can be re-applied.
