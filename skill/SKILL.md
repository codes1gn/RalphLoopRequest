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

## Three-Layer Checkpoint Architecture

durable-request uses three layers. The agent tries them in order of preference:

```
Layer 1 (tool-based)              Layer 2 (CLI tool)                Layer 3 (conversational)
────────────────────────────────  ────────────────────────────────  ────────────────────────
AskQuestion / AskUserQuestion     checkpoint.sh via Shell tool      Numbered text options
Built-in agent tool               Tmux split-pane interactive UI    Plain text fallback
Blocks agent turn, UI widget      Blocks via file lock + polling    Works everywhere
User picks from structured UI     User picks in tmux pane           User types response
Cursor editor, Claude Code        Cursor CLI (requires tmux)        Subagents, all platforms
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

**Try tools in this order (first match wins):**

| Priority | Signal | Environment | Action |
|:--------:|--------|------------|--------|
| 1 | `AskQuestion` is in your tool list AND `Shell` is also available | Cursor (editor or CLI) | Call **both** `AskQuestion` and `checkpoint.sh` via Shell **in the same tool call batch** — whichever succeeds first wins |
| 2 | `AskQuestion` is in your tool list but NO `Shell` | Cursor editor (subagent) | Call `AskQuestion` only |
| 3 | `AskUserQuestion` is in your tool list | Claude Code | Call `AskUserQuestion` |
| 4 | `question` is in your tool list | OpenCode | Call `question` |
| 5 | Your context starts with a Task tool prompt | Subagent | Conversational fallback |
| 6 | None of the above | Other CLI | Conversational fallback |

<EXTREMELY-IMPORTANT>
**Priority 1 is critical.** In Cursor CLI, `AskQuestion` is listed as a tool but does NOT work — it will fail or be interrupted. By calling BOTH `AskQuestion` and `checkpoint.sh` in the same batch:
- In the **editor**: `AskQuestion` succeeds, `checkpoint.sh` output is ignored
- In **CLI**: `AskQuestion` fails, but `checkpoint.sh` already has the user's response

If you only call `AskQuestion` and it fails, you MUST immediately call `checkpoint.sh` via Shell as your next action. **Do NOT fall back to conversational checkpoint when Shell is available.**
</EXTREMELY-IMPORTANT>

#### Cursor Editor (Parent Agent): Call `AskQuestion`

Call `AskQuestion` with a **single question**. The last option MUST always be a freeform/custom option — never omit it:

```json
{
  "title": "Task Checkpoint",
  "questions": [
    {
      "id": "next_action",
      "prompt": "<1-2 sentence summary of what was completed>. What would you like to do next?",
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
- **Last option must always be `custom`** — the user can type a free-form instruction instead of picking a preset
- Adapt `prompt` and middle `options` to the task context (e.g., "Run tests", "Deploy", "Commit")

`AskQuestion` **blocks your turn without ending the request**. The user sees a UI widget, selects an option, and you continue in the same request context. This is what makes the request "durable."

#### Cursor CLI (Parent Agent): Call `checkpoint.sh` via Shell

In Cursor CLI, `AskQuestion` is not available. Instead, use the **checkpoint.sh** CLI tool which opens a tmux split pane with an interactive prompt and returns the user's choice:

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
- First argument is the prompt (1-2 sentence summary of what was completed + "What would you like to do next?")
- Subsequent arguments are context-adapted options
- The script automatically appends a freeform "I'll type my own instruction" option as the last choice
- The script returns `[durable-request] User responded: <choice>` — use this to continue
- If tmux is not available, the script falls back with an auto-selected first option and prints setup instructions

**How it works:** The Shell call blocks while `checkpoint.sh` creates a tmux split pane running `checkpoint-ui.sh`. The user sees an interactive prompt in the bottom pane, selects an option, and the pane auto-closes. The agent reads the response from stdout and continues — same request, same context.

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

#### If `AskQuestion` FAILED or was INTERRUPTED:

<EXTREMELY-IMPORTANT>
**Do NOT fall back to conversational. You MUST call `checkpoint.sh` via Shell.**

This is the expected behavior in Cursor CLI. `AskQuestion` is listed but does not work. The correct action is:
</EXTREMELY-IMPORTANT>

```bash
bash ~/.cursor/skills/durable-request/checkpoint.sh \
  "<same prompt>" "<option 1>" "<option 2>" ... "Done"
```

Only if `checkpoint.sh` ALSO fails (no tmux), THEN present conversational fallback.

> **[durable-request]** `AskQuestion` failed/interrupted. Calling `checkpoint.sh` via Shell...

#### If `checkpoint.sh` FAILED (no tmux / error):

The script prints setup instructions and falls back with auto-selected first option. Tell the user:
> **[durable-request]** `checkpoint.sh` failed (no tmux session). For interactive checkpoints, run `cursor-agent` inside tmux. Falling back to conversational checkpoint.

Then present the conversational fallback.

#### If ALL tools are UNAVAILABLE (subagent / no Shell):

Tell the user explicitly:
> **[durable-request]** `AskQuestion` is not available in this environment (subagent / tool not found). Falling back to conversational checkpoint.

Then present the conversational fallback, formatted for terminal readability:

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

#### If you are CERTAIN you are a subagent:

> **[durable-request]** Running as a subagent (launched via Task tool). `AskQuestion` is not available to subagents. Presenting conversational checkpoint.

Then present the conversational fallback.

### The TodoWrite + Checkpoint Reinforcement Pattern

The key insight: calling `TodoWrite` and the checkpoint **together in the same tool call batch** creates a double-lock:

```
┌─────────────────── SAME TOOL CALL BATCH ───────────────────┐
│                                                             │
│  TodoWrite([{                          AskQuestion({       │
│    id: "durable-checkpoint",             title: "...",     │
│    content: "Present checkpoint",        questions: [...]  │
│    status: "in_progress"               })                  │
│  }])                                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Cascade on failure (ALWAYS follow this order):**

1. `AskQuestion` succeeds → blocks turn, user responds, mark todo complete, continue
2. `AskQuestion` fails/interrupted → **try `checkpoint.sh` via Shell** (if Shell available)
3. `checkpoint.sh` succeeds → Shell blocks, user responds in tmux pane, continue
4. `checkpoint.sh` fails (no tmux) → present conversational fallback, mark todo complete
5. No Shell access (subagent) → conversational fallback immediately

**Never skip step 2.** If `AskQuestion` fails in Cursor CLI, `checkpoint.sh` is the designed solution.

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
