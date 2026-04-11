---
name: durable-request
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

The ONLY exception: pure informational Q&A with no action taken (e.g., "What does git rebase do?").
</EXTREMELY-IMPORTANT>

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

| Signal | Environment | Interactive Tool |
|--------|------------|-----------------|
| You have `AskQuestion` in your tool list | Cursor parent agent | `AskQuestion` |
| You have `AskUserQuestion` in your tool list | Claude Code | `AskUserQuestion` |
| You have `question` in your tool list | OpenCode | `question` |
| Your context starts with a Task tool prompt | Cursor/Claude subagent | None — fallback |
| None of the above tools exist | CLI / other | None — fallback |

#### Cursor Parent Agent: Call `AskQuestion`

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

#### Claude Code: Call `AskUserQuestion`

Same pattern, adapted to Claude Code's schema.

#### OpenCode: Call `question`

Same pattern, adapted to OpenCode's schema.

### Step 3: Handle the Result — VERBOSE and EXPLICIT

<EXTREMELY-IMPORTANT>
**You MUST be explicit about what happened.** Never silently fall back. Never silently succeed. Always tell the user what tool you attempted and what the outcome was.
</EXTREMELY-IMPORTANT>

#### If the tool SUCCEEDED (AskQuestion / AskUserQuestion / question returned a response):

Tell the user explicitly:

> **[durable-request]** Called `AskQuestion` — your selection was received. Continuing in the same request.

Then execute the user's selected action. After completing it, loop back to Step 1 (register new checkpoint todo → call AskQuestion again → ...). Continue until the user selects "done."

#### If the tool FAILED or is UNAVAILABLE:

Tell the user explicitly what happened and fall back:

> **[durable-request]** Attempted to call `AskQuestion` but it is not available in this environment (subagent / CLI / tool not found). Falling back to conversational checkpoint.

Or if it errored:

> **[durable-request]** Called `AskQuestion` but received an error: `<error message>`. Falling back to conversational checkpoint.

Then present the conversational fallback:

```
---
**Completed:** [1-2 sentence summary]

**What's next?**
1. [context-adapted option]
2. [context-adapted option]
3. [context-adapted option]
4. Something else entirely
5. Done for now

Or just tell me what to do next:
---
```

#### If you are CERTAIN you are a subagent:

> **[durable-request]** Running as a subagent (launched via Task tool). `AskQuestion` is not available to subagents. Presenting conversational checkpoint.

Then present the conversational fallback.

### The TodoWrite + AskQuestion Reinforcement Pattern

The key insight: calling `TodoWrite` and `AskQuestion` **together in the same tool call batch** creates a double-lock:

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

- If `AskQuestion` succeeds → it blocks the turn, user responds, you mark the todo complete and continue.
- If `AskQuestion` fails → the todo remains `in_progress`, which prevents you from ending silently. You MUST address it by presenting the conversational fallback and then marking it complete.

This is **not optional**. Always pair them.

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
│       │                                            │       │
│       └─────────── anything else ◀─────────────────┘       │
│                                                              │
│  If AskQuestion unavailable:                                 │
│  TodoWrite stays in_progress → MUST address → fallback      │
│  → tell user WHY tool failed → present numbered options      │
│                                                              │
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
