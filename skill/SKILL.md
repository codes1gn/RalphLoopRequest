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

## Checkpoint Architecture

durable-request uses platform-specific blocking checkpoints:

```
Cursor Editor               Cursor CLI                    Subagent / Other
─────────────────────────   ────────────────────────────   ────────────────────────
AskQuestion                 checkpoint.sh via Shell        Numbered text options
Built-in UI widget          Tmux split-pane interactive    Plain text fallback
Blocks turn, same request   Blocks via file polling        Non-blocking
User picks from structured  User picks in tmux pane        User types response
```

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

**Detect your environment and use the right tool:**

| Priority | Signal | Environment | Action |
|:--------:|--------|------------|--------|
| 1 | You are running inside Cursor **CLI** (no GUI, terminal-only) | Cursor CLI | Call `checkpoint.sh` via Shell |
| 2 | `AskQuestion` is available | Cursor editor (IDE) | Call `AskQuestion` |
| 3 | `AskUserQuestion` is available | Claude Code | Call `AskUserQuestion` |
| 4 | `question` is available | OpenCode | Call `question` |
| 5 | None of the above | Subagent / Other | Conversational fallback |

**How to detect Cursor CLI vs IDE:** If `AskQuestion` is called and it **fails or is interrupted** (returns an error), you are in Cursor CLI. Immediately switch to `checkpoint.sh` via Shell. Do NOT fall back to conversational text.

<EXTREMELY-IMPORTANT>
**In Cursor CLI: ALWAYS use `checkpoint.sh` via Shell. NEVER use conversational fallback (numbered text options).**
If `AskQuestion` fails, that confirms you are in CLI — call `checkpoint.sh` immediately.
Conversational fallback is ONLY for subagents that lack Shell access.
</EXTREMELY-IMPORTANT>

#### Cursor Editor (IDE): Call `AskQuestion`

In the Cursor IDE (graphical editor), call `AskQuestion` with a **single question**:

```json
{
  "title": "Task Checkpoint",
  "questions": [
    {
      "id": "next_action",
      "prompt": "<1-2 sentence summary>. What would you like to do next?",
      "options": [
        {"id": "iterate",   "label": "Iterate / refine what was just done"},
        {"id": "continue",  "label": "Continue to the next step"},
        {"id": "review",    "label": "Review the changes in detail"},
        {"id": "different", "label": "Switch to a different task"},
        {"id": "done",      "label": "I'm satisfied, we're done"},
        {"id": "custom",    "label": "I'll type my own instruction"}
      ],
      "allow_multiple": false
    }
  ]
}
```

Rules:
- **Single question only** — never use multiple questions
- **Last option must always be `custom`**
- Adapt `prompt` and middle `options` to the task context

`AskQuestion` **blocks your turn without ending the request**. This is what makes the request "durable."

**If `AskQuestion` fails or is interrupted → you are in Cursor CLI.** Switch to `checkpoint.sh` immediately (see below).

#### Cursor CLI: Call `checkpoint.sh` via Shell

<EXTREMELY-IMPORTANT>
**In Cursor CLI, ALWAYS use `checkpoint.sh` via Shell. NEVER use `AskQuestion` (it does not work in CLI). NEVER fall back to conversational text.**
</EXTREMELY-IMPORTANT>

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
- Call this via the **Shell** tool
- First argument is the prompt (1-2 sentence summary + "What would you like to do next?")
- Subsequent arguments are context-adapted options
- The script automatically appends "I'll type my own instruction" as the last choice
- The script returns `[durable-request] User responded: <choice>` — use this to continue
- If tmux is not available, the script auto-selects the first option

**How it works:** The Shell call blocks while `checkpoint.sh` creates a tmux split pane running `checkpoint-ui.sh`. The user sees an interactive prompt in the bottom pane, selects an option, and the pane auto-closes. The agent reads the response and continues — same request, same context.

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
│  TodoWrite([{                          AskQuestion({       │
│    id: "durable-checkpoint",             ...               │
│    content: "Present checkpoint",      })                  │
│    status: "in_progress"               OR                  │
│  }])                                   Shell: checkpoint.sh│
│                                        (in CLI)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- **IDE**: `AskQuestion` blocks turn, user responds, mark todo complete, continue
- **CLI**: `checkpoint.sh` via Shell blocks, user responds in tmux pane, continue
- **CLI (AskQuestion tried first and failed)**: immediately call `checkpoint.sh`
- **Subagent**: conversational fallback in text

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
