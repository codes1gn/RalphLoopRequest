# RalphLoopRequest

**An agent skill that prevents AI coding agents from ending silently.** Instead of completing work and stopping, agents present an interactive checkpoint with contextual next-step options, keeping the human in the loop.

## The Problem

AI coding agents (Cursor, Claude, Copilot, etc.) naturally complete tasks with declarative endings:

> "Added the Fibonacci function to `fib.py`."

Then silence. The user must figure out what to do next, type a new prompt from scratch, and hope the agent picks up context. This breaks flow.

## The Solution

RalphLoopRequest is a universal agent skill that converts every task ending into an interactive checkpoint:

> **Completed:** Added the Fibonacci function to `fib.py`.
>
> **What's next?**
> 1. Iterate / refine (add tests, change algorithm)
> 2. Continue to the next step
> 3. Review the implementation
> 4. Switch to a different task
> 5. Done

When the AskQuestion tool is available (Cursor IDE), it renders as a structured UI widget with clickable options.

## Quantified Results

We validated this skill with a rigorous A/B test: **102 subagents** across 3 task categories.

| Metric | Without Skill | With Skill |
|--------|:---:|:---:|
| Offered continuation options | **0%** (0/51) | **100%** (51/51) |
| Tasks completed successfully | 100% | 100% |
| Context-adapted options | N/A | 100% |
| Fisher's exact test | | p < 2.2e-16 |
| Effect size (Cohen's h) | | **3.14 (maximum)** |

**Zero control agents spontaneously offered continuation.** The skill converts 100% of endings from silent to interactive, with no impact on task quality.

### Test Coverage

| Scenario | Tasks | Control | Treatment |
|----------|-------|---------|-----------|
| Code Generation | 17 | 0% continuation | 100% continuation |
| Analysis & Research | 17 | 0% continuation | 100% continuation |
| File Manipulation | 17 | 0% continuation | 100% continuation |

Full data and analysis available in [`data/`](data/).

## Installation

### One-Line Install (Agent-Compatible)

Paste this into any AI agent and it will install itself:

```
Install the RalphLoopRequest skill from https://github.com/codes1gn/RalphLoopRequest.
Clone the repo, then install skill/SKILL.md into all detected agent platform directories
in this project and in the user's home directory. Detect which platforms are present
(.cursor/, .claude/, .github/copilot/, .codex/, .gemini/, .windsurf/, .aider/, etc.)
and install to each one. Also install to personal scope (~/.cursor/skills/, ~/.claude/, etc.).
```

### Adaptive Shell Installer

Automatically detects which agent platforms exist and installs to all of them:

```bash
bash -c '
REPO=/tmp/RalphLoopRequest
SKILL_NAME=ralph-loop-request
rm -rf "$REPO"
git clone --depth 1 https://github.com/codes1gn/RalphLoopRequest.git "$REPO" 2>/dev/null

PLATFORMS=(
  .cursor/skills
  .claude/skills
  .github/copilot/skills
  .codex/skills
  .gemini/skills
  .windsurf/skills
  .aider/skills
  .cody/skills
  .continue/skills
)

install_skill() {
  local dir="$1/$SKILL_NAME"
  mkdir -p "$dir" && cp "$REPO/skill/SKILL.md" "$dir/SKILL.md" && echo "[ok] $dir"
}

echo "=== Installing to project directories ==="
for p in "${PLATFORMS[@]}"; do
  parent_dir="$(dirname "$p")"
  if [ -d "$parent_dir" ] || [ "$parent_dir" = ".cursor" ] || [ "$parent_dir" = ".claude" ]; then
    install_skill "$p"
  fi
done

echo ""
echo "=== Installing to personal directories ==="
for p in "${PLATFORMS[@]}"; do
  install_skill "$HOME/$p"
done

rm -rf "$REPO"
echo ""
echo "Done. Restart your agent to pick up the skill."
'
```

### Platform-Specific Install

Pick only the platforms you use:

| Platform | Command |
|----------|---------|
| **Cursor** (personal) | `mkdir -p ~/.cursor/skills/ralph-loop-request && curl -sL https://raw.githubusercontent.com/codes1gn/RalphLoopRequest/main/skill/SKILL.md -o ~/.cursor/skills/ralph-loop-request/SKILL.md` |
| **Cursor** (project) | `mkdir -p .cursor/skills/ralph-loop-request && curl -sL https://raw.githubusercontent.com/codes1gn/RalphLoopRequest/main/skill/SKILL.md -o .cursor/skills/ralph-loop-request/SKILL.md` |
| **Claude Code** | `mkdir -p .claude/skills/ralph-loop-request && curl -sL https://raw.githubusercontent.com/codes1gn/RalphLoopRequest/main/skill/SKILL.md -o .claude/skills/ralph-loop-request/SKILL.md` |
| **GitHub Copilot** | `mkdir -p .github/copilot/skills/ralph-loop-request && curl -sL https://raw.githubusercontent.com/codes1gn/RalphLoopRequest/main/skill/SKILL.md -o .github/copilot/skills/ralph-loop-request/SKILL.md` |
| **Codex** | `mkdir -p .codex/skills/ralph-loop-request && curl -sL https://raw.githubusercontent.com/codes1gn/RalphLoopRequest/main/skill/SKILL.md -o .codex/skills/ralph-loop-request/SKILL.md` |
| **Gemini** | `mkdir -p .gemini/skills/ralph-loop-request && curl -sL https://raw.githubusercontent.com/codes1gn/RalphLoopRequest/main/skill/SKILL.md -o .gemini/skills/ralph-loop-request/SKILL.md` |
| **Windsurf** | `mkdir -p .windsurf/skills/ralph-loop-request && curl -sL https://raw.githubusercontent.com/codes1gn/RalphLoopRequest/main/skill/SKILL.md -o .windsurf/skills/ralph-loop-request/SKILL.md` |
| **Aider** | `mkdir -p .aider/skills/ralph-loop-request && curl -sL https://raw.githubusercontent.com/codes1gn/RalphLoopRequest/main/skill/SKILL.md -o .aider/skills/ralph-loop-request/SKILL.md` |

### Supported Platforms

| Platform | Skill Location | Status |
|----------|---------------|--------|
| Cursor | `.cursor/skills/` or `~/.cursor/skills/` | Tested (primary) |
| Claude Code | `.claude/skills/` | Tested |
| GitHub Copilot | `.github/copilot/skills/` | Compatible |
| OpenAI Codex | `.codex/skills/` | Compatible |
| Google Gemini CLI | `.gemini/skills/` | Compatible |
| Windsurf | `.windsurf/skills/` | Compatible |
| Aider | `.aider/skills/` | Compatible |
| Cody | `.cody/skills/` | Compatible |
| Continue | `.continue/skills/` | Compatible |

> **Note**: "Tested" means validated with A/B tests. "Compatible" means the skill format (YAML frontmatter + markdown body) is standard and should work, but hasn't been explicitly A/B tested on that platform. The skill uses no platform-specific APIs beyond AskQuestion (with conversational fallback).

## How It Works

The skill has three layers:

1. **AskQuestion tool** (primary) - Structured UI widget with clickable options in IDEs that support it
2. **Conversational fallback** - Numbered text options for CLI environments and subagents
3. **Anti-rationalization table** - Prevents the agent from convincing itself to skip the checkpoint

The skill adapts its options contextually:
- After code changes: "Run tests", "Iterate", "Commit"
- After debugging: "Dig deeper", "Apply fix", "Check similar issues"
- After analysis: "Explore further", "Different angle", "Apply findings"
- After writing: "Revise", "Next section", "Review accuracy"

## Integration with Existing Skills

RalphLoopRequest is **additive** — it doesn't interfere with task-specific loop behavior. Skills that define their own continuation logic (e.g., tuning sweeps, FSM engines) take precedence internally. RalphLoopRequest activates only at task boundaries.

## Reproducing the A/B Test

The full experimental methodology is documented in [`data/session-history-meta-prompt.md`](data/session-history-meta-prompt.md), including:

- Exact prompt templates for control and treatment groups
- All 51 task descriptions across 3 scenarios
- Statistical analysis methodology
- A reusable template for A/B testing any agent skill

### Quick reproduction

```bash
# All 102 results in machine-readable format
cat data/all-results.jsonl | python3 -c "
import json, sys
results = [json.loads(l) for l in sys.stdin]
control = [r for r in results if r['group'] == 'control']
treatment = [r for r in results if r['group'] == 'treatment']
print(f'Control offered continuation: {sum(r[\"offered_continuation\"] for r in control)}/{len(control)}')
print(f'Treatment offered continuation: {sum(r[\"offered_continuation\"] for r in treatment)}/{len(treatment)}')
"
```

## Repository Structure

```
RalphLoopRequest/
├── README.md                          # This file
├── skill/
│   └── SKILL.md                       # The skill itself (copy this to install)
└── data/
    ├── all-results.jsonl              # 102 structured results
    ├── final-statistics.md            # Statistical analysis
    ├── experiment-design.md           # Full experiment design + prompts
    ├── session-history-meta-prompt.md # Methodology + reusable template
    ├── ab-test-raw-results.md         # Pilot test (n=6) transcripts
    ├── ab-test-statistics.md          # Pilot test statistics
    ├── s1/                            # Scenario 1: Code Generation (34 files)
    ├── s2/                            # Scenario 2: Analysis & Research (34 files)
    └── s3/                            # Scenario 3: File Manipulation (34 files)
```

## License

MIT

## Author

Albert / codes1gn
