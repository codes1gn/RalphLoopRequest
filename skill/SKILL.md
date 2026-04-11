---
name: durable-request
author: Heng Shi <heng.shi@enflame-tech.com>
description: Universal end-of-task continuation gate. Forces every agent turn that completes work to present an interactive checkpoint (AskQuestion or conversational) instead of silently finishing. Applies to ALL tasks — coding, writing, debugging, research, analysis, refactoring, any prompt. Use always, on every task completion, before ending any turn where work was performed.
---

# Durable Request — Never End Silently

<EXTREMELY-IMPORTANT>
## The One Rule

**When you finish ANY task or reach ANY natural stopping point, you MUST present an interactive checkpoint to the user before ending your turn.** No exceptions. No silent completions.

This applies to:
- Code changes (new features, bug fixes, refactors)
- File operations (create, edit, delete, move)
- Research or analysis tasks
- Writing or documentation
- Debugging sessions
- Configuration changes
- ANY work that produces output or side effects
- Pure informational Q&A (e.g., "What does git rebase do?")

**No exceptions. No silent completions. Always checkpoint.**
</EXTREMELY-IMPORTANT>

## Two-Layer Checkpoint Architecture

durable-request uses two layers:

```
Layer 1 (primary — blocking)               Layer 2 (subagent fallback)
─────────────────────────────────────────   ────────────────────────────
checkpoint.sh via Shell tool                Numbered text options
Tmux split-pane interactive UI              Plain text in response
Blocks agent turn via file polling          Non-blocking (subagents only)
User picks in tmux pane                     User types response
Cursor editor + CLI, Claude Code, OpenCode  Subagents (no Shell access)
```

**If you have `Shell` access, ALWAYS use checkpoint.sh. NEVER use conversational fallback.**

## Checkpoint Mechanism

### Step 1: Anchor Checkpoint Intent with TodoWrite

Before attempting ANY interactive tool, **always call `TodoWrite` first** (or the equivalent task-tracking tool in your environment) to register the checkpoint as an unfinished obligation:

```
TodoWrite([
  { id: "durable-checkpoint", content: "Present interactive checkpoint to user", status: "in_progress" },
  ... (keep any existing todos)
])
```

This serves two purposes:
1. **Structural anchor**: The todo list now shows an incomplete item. You cannot end your turn with an `in_progress` todo — it forces you to resolve it.
2. **Audit trail**: If the interactive tool fails or is unavailable, the todo makes the failure visible rather than silent.

**After the user responds to the checkpoint**, mark it complete:
```
TodoWrite([
  { id: "durable-checkpoint", status: "completed" }
])
```

### Step 2: Attempt the Interactive Tool

Detect your environment and attempt the appropriate interactive tool. **Always try the tool first. Report the outcome explicitly.**

#### Environment Detection

**Try tools in this order (first match wins):**

| Priority | Signal | Environment | Action |
|:--------:|--------|------------|--------|
| 1 | `AskQuestion` AND `Shell` available | Cursor (editor or CLI) | Call `checkpoint.sh` via Shell |
| 2 | `AskQuestion` available, no `Shell` | Cursor editor (subagent) | Call `AskQuestion` |
| 3 | `AskUserQuestion` available | Claude Code | Call `AskUserQuestion` |
| 4 | `question` available | OpenCode | Call `question` |
| 5 | None of the above | Other | Conversational fallback |

<EXTREMELY-IMPORTANT>
**Priority 1: When both `AskQuestion` and `Shell` are available, ALWAYS use `checkpoint.sh` via Shell — NEVER use `AskQuestion`.**

Why: In Cursor CLI, `AskQuestion` is listed but does NOT work. `checkpoint.sh` works in both editor and CLI (it creates a tmux split pane). Using `checkpoint.sh` as the primary tool eliminates the failure cascade entirely.

**NEVER present conversational fallback (numbered text options) when `Shell` is available.** Conversational fallback is ONLY for environments where `Shell` is not available (subagents).
</EXTREMELY-IMPORTANT>

#### Cursor (Editor + CLI): Call `checkpoint.sh` via Shell

**This is the primary checkpoint mechanism for ALL Cursor environments.** Call `checkpoint.sh` via the Shell tool. It creates a tmux split pane with an interactive prompt and returns the user's choice:

```bash
bash ~/.cursor/skills/durable-request/checkpoint.sh \
  "Task completed. What would you like to do next?" \
  "Run tests" \
  "Iterate on the implementation" \
  "Review the diff" \
  "Commit changes" \
  "Done for now"
```

**Prerequisite:** cursor-agent must be running inside a tmux session. Add this alias to `~/.bashrc`:

```bash
alias cursor-agent='tmux new-session -A -s cursor -- cursor-agent'
```

Rules:
- Call this via the **Shell** tool — do NOT use `AskQuestion`
- First argument is the prompt (1-2 sentence summary + "What would you like to do next?")
- Subsequent arguments are context-adapted options
- The script automatically appends a freeform "I'll type my own instruction" option as the last choice
- The script returns `[durable-request] User responded: <choice>` — use this to continue
- If tmux is not available, the script falls back with an auto-selected first option

**How it works:** The Shell call blocks while `checkpoint.sh` creates a tmux split pane running `checkpoint-ui.sh`. The user sees an interactive prompt in the bottom pane, selects an option, and the pane auto-closes. The agent reads the response from stdout and continues — same request, same context.

<EXTREMELY-IMPORTANT>
**Do NOT call `AskQuestion` in Cursor.** `AskQuestion` does not work in Cursor CLI. Always use `checkpoint.sh` via Shell instead. This works in both editor and CLI environments.
</EXTREMELY-IMPORTANT>

#### Claude Code: Call `AskUserQuestion`

Same pattern, adapted to Claude Code's schema.

#### OpenCode: Call `question`

Same pattern, adapted to OpenCode's schema.

### Step 3: Handle the Result — VERBOSE and EXPLICIT

<EXTREMELY-IMPORTANT>
**You MUST be explicit about what happened.** Never silently fall back. Never silently succeed. Always tell the user what tool you attempted and what the outcome was.
</EXTREMELY-IMPORTANT>

#### If the tool SUCCEEDED:

For `AskQuestion` / `AskUserQuestion` / `question`:
> **[durable-request]** Called `AskQuestion` — your selection was received. Continuing in the same request.

For `checkpoint.sh` (CLI): The output contains `[durable-request] User responded: <choice>`. Parse the choice and continue:
> **[durable-request]** Called `checkpoint.sh` — user responded: "<choice>". Continuing.

Then execute the user's selected action. After completing it, loop back to Step 1 (register new checkpoint todo → checkpoint again → ...). Continue until the user selects "done."

#### If `checkpoint.sh` FAILED (no tmux / error):

The script auto-selects the first option and prints setup instructions. Tell the user:
> **[durable-request]** `checkpoint.sh` requires tmux. Run `cursor-agent` inside tmux: `tmux new-session -A -s cursor -- cursor-agent`

The agent continues with the auto-selected option.

#### If NO `Shell` available (subagent only):

Only subagents lack Shell access. In this case, present conversational fallback:

> **[durable-request]** Running as a subagent. Presenting checkpoint.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Completed: [1-2 sentence summary]

 What's next?
  1. [context-adapted option]
  2. [context-adapted option]
  3. [context-adapted option]
  4. Something else entirely
  5. Done for now

 Or just tell me what to do next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

<EXTREMELY-IMPORTANT>
**Conversational fallback (numbered text in response) is ONLY for subagents that lack Shell access.**
If you have `Shell`, you MUST use `checkpoint.sh`. NEVER output conversational fallback when Shell is available.
</EXTREMELY-IMPORTANT>

### The TodoWrite + Checkpoint Reinforcement Pattern

The key insight: calling `TodoWrite` and the checkpoint **together in the same tool call batch** creates a double-lock:

```
┌─────────────────── SAME TOOL CALL BATCH ───────────────────┐
│                                                             │
│  TodoWrite([{                     Shell: checkpoint.sh     │
│    id: "durable-checkpoint",        "What's next?"         │
│    content: "Present checkpoint",   "Run tests" "Commit"   │
│    status: "in_progress"            "Done"                  │
│  }])                              (blocks until user picks) │
│                                                             │
│  Subagent (no Shell): TodoWrite + conversational fallback  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- `checkpoint.sh` succeeds → Shell blocks, user responds in tmux pane, mark todo complete, continue
- `checkpoint.sh` fails (no tmux) → auto-selects first option, agent continues
- No Shell (subagent) → conversational fallback in text

This is **not optional**. Always pair TodoWrite with the checkpoint.

## Anti-Silent-Completion Rules

These thoughts mean STOP — you're about to end silently:

| Thought | Correct Action |
|---------|---------------|
| "Task is done, I'll wrap up" | Present checkpoint FIRST |
| "That's all they asked for" | They may want more — ASK |
| "Simple change, no need to check" | Simple changes still need confirmation |
| "I already explained what I did" | Explanation ≠ checkpoint. Still ask. |
| "The output speaks for itself" | Never assume. Present options. |
| "They'll ask if they want more" | YOUR job to offer. Don't shift burden. |
| "I'm a subagent, I just return results" | Still present the fallback. Say WHY AskQuestion is unavailable. |
| "AskQuestion isn't available" | Say so explicitly, then use fallback. NEVER silently skip. |
| "TodoWrite is overhead" | TodoWrite is the anchor that prevents silent endings. Always use it. |

## Contextual Adaptation

Adapt checkpoint options to what was just done:

| Task Type | Suggested Options |
|-----------|------------------|
| Code changes | Run tests, Iterate implementation, Related changes, Commit, Done |
| Debugging | Dig deeper, Apply fix, Check similar issues, Done |
| Writing/docs | Revise/polish, Write next section, Review accuracy, Done |
| Research/analysis | Explore further, Different angle, Apply to code, Done |
| File operations | Verify output, Modify format, Additional operations, Done |
| Configuration | Test the config, Additional settings, Revert, Done |

## Multi-Step Tasks

For tasks with multiple steps:
1. Complete each step
2. Present a **brief** checkpoint after each significant step (not every micro-action)
3. If user selects "Continue", proceed and checkpoint again after the next step
4. Final checkpoint should be more comprehensive

**Significant step** = anything that changes files, produces output, or takes > 30 seconds.

## The Durable Loop Pattern

### Editor (AskQuestion available)

```
┌──────────────────────────────────────────────────────────────┐
│                      Single Request                          │
│                                                              │
│  ┌──────────┐  ┌───────────┐  ┌────────────┐  ┌──────────┐ │
│  │ Do Work  │─▶│ TodoWrite │─▶│ AskQuestion│─▶│ User     │ │
│  │          │  │ (anchor)  │  │ (block)    │  │ Responds │ │
│  └──────────┘  └───────────┘  └────────────┘  └────┬─────┘ │
│       ▲                                            │       │
│       │        "done" ────────────────────▶  END   │       │
│       └─────────── anything else ◀─────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

### CLI (checkpoint.sh via Shell — true durable loop)

```
┌──────────────────────────────────────────────────────────────┐
│                      Single Request                          │
│                                                              │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐ ┌──────────┐│
│  │ Do Work  │─▶│ TodoWrite │─▶│ Shell:       │─▶│ User     ││
│  │          │  │ (anchor)  │  │ checkpoint.sh│  │ picks in ││
│  └──────────┘  └───────────┘  │ (blocks)     │  │ terminal ││
│       ▲                       └──────────────┘  └────┬─────┘│
│       │        "done" ────────────────────────▶ END  │      │
│       └─────────── anything else ◀───────────────────┘      │
│                                                              │
│  checkpoint.sh creates tmux split pane → user picks option   │
│  → pane auto-closes → agent reads response from stdout       │
└──────────────────────────────────────────────────────────────┘
```

### Subagent / Other (conversational fallback)

```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌───────────┐  ┌────────────────────────┐    │
│  │ Do Work  │─▶│ TodoWrite │─▶│ Conversational         │    │
│  │          │  │ (anchor)  │  │ checkpoint (numbered   │    │
│  └──────────┘  └───────────┘  │ options in text)       │    │
│                                └───────────────────────┘    │
│  TodoWrite stays in_progress → MUST address → fallback      │
└──────────────────────────────────────────────────────────────┘
```

## Integration with Other Skills

This skill does NOT override task-specific loop behavior. Skills with their own loop/continuation logic (e.g., tuning sweeps, FSM engines) take precedence internally. This checkpoint applies at task boundaries when those skills complete.

**Priority:** Task-specific loops > durable-request (at task boundaries only)

## What This Skill Is NOT

- NOT a gate that blocks progress
- NOT a replacement for task-specific checkpoints
- NOT permission to slow down autonomous work within a task
- It IS a universal "don't disappear after finishing" mechanism
