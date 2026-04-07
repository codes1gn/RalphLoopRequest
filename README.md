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

Installs to all supported platforms — both project-level (current directory) and personal (home directory):

```bash
bash -c '
REPO=/tmp/_rlr_install
SKILL=ralph-loop-request
SRC=skill/SKILL.md
rm -rf "$REPO"
git clone --depth 1 https://github.com/codes1gn/RalphLoopRequest.git "$REPO" 2>/dev/null || {
  echo "[error] git clone failed"; exit 1
}

DIRS=(
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

ok=0 skip=0
for d in "${DIRS[@]}"; do
  # Project-level: install to all platforms
  mkdir -p "$d/$SKILL" && cp "$REPO/$SRC" "$d/$SKILL/SKILL.md" && echo "[ok] ./$d/$SKILL" && ((ok++))
  # Personal: install to home
  mkdir -p "$HOME/$d/$SKILL" && cp "$REPO/$SRC" "$HOME/$d/$SKILL/SKILL.md" && echo "[ok] ~/$d/$SKILL" && ((ok++))
done

rm -rf "$REPO"
echo ""
echo "Installed to $ok locations across $(( ${#DIRS[@]} )) platforms."
echo "Restart your agent session to activate."
'
```

> **Note**: This installs to ALL platforms unconditionally. To install only to detected platforms, add `[ -d "$(dirname "$d")" ] &&` before each `mkdir`.

### Platform-Specific Install

Pick only the platforms you use. Each command clones, copies, and cleans up (works even when `raw.githubusercontent.com` is blocked):

```bash
# Helper function — paste once, then use per-platform commands below
rlr_install() {
  local T=/tmp/_rlr D="$1/ralph-loop-request"
  rm -rf "$T" && git clone --depth 1 https://github.com/codes1gn/RalphLoopRequest.git "$T" 2>/dev/null \
    && mkdir -p "$D" && cp "$T/skill/SKILL.md" "$D/SKILL.md" && rm -rf "$T" && echo "[ok] $D"
}
```

| Platform | Command |
|----------|---------|
| **Cursor** (personal) | `rlr_install ~/.cursor/skills` |
| **Cursor** (project) | `rlr_install .cursor/skills` |
| **Claude Code** | `rlr_install .claude/skills` |
| **GitHub Copilot** | `rlr_install .github/copilot/skills` |
| **Codex** | `rlr_install .codex/skills` |
| **Gemini** | `rlr_install .gemini/skills` |
| **Windsurf** | `rlr_install .windsurf/skills` |
| **Aider** | `rlr_install .aider/skills` |
| **Cody** | `rlr_install .cody/skills` |
| **Continue** | `rlr_install .continue/skills` |

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
