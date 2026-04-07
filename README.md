<p align="center">
  <h1 align="center">RalphLoopRequest</h1>
  <p align="center">
    <strong>Make every AI agent request 5x more durable.</strong><br>
    <sub>One skill that turns single-shot agent interactions into multi-turn conversations.</sub>
  </p>
</p>

<p align="center">
  <a href="https://github.com/codes1gn/RalphLoopRequest/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://github.com/codes1gn/RalphLoopRequest/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/codes1gn/RalphLoopRequest?style=social"></a>
  <a href="https://github.com/codes1gn/RalphLoopRequest/issues"><img alt="Issues" src="https://img.shields.io/github/issues/codes1gn/RalphLoopRequest"></a>
  <img alt="A/B Tested" src="https://img.shields.io/badge/A%2FB%20Tested-102%20agents-brightgreen">
  <img alt="Effect Size" src="https://img.shields.io/badge/Effect%20Size-Maximum%20(π)-orange">
  <img alt="p-value" src="https://img.shields.io/badge/p--value-%3C%202.2e--16-red">
  <img alt="Platforms" src="https://img.shields.io/badge/Platforms-9%20supported-purple">
  <img alt="ROI" src="https://img.shields.io/badge/Request%20ROI-5x%20more%20durable-gold">
</p>

<p align="center">
  <a href="#the-economics">Why</a> &bull;
  <a href="#installation">Install</a> &bull;
  <a href="#quantified-results">Results</a> &bull;
  <a href="#how-it-works">How It Works</a> &bull;
  <a href="#supported-platforms">Platforms</a> &bull;
  <a href="#reproducing-the-ab-test">Reproduce</a>
</p>

---

## The Economics

AI agent requests are **expensive**. On usage-based pricing (Cursor, Claude Pro, Copilot, API credits), every request costs real money. Here's the problem:

```
Without RalphLoopRequest:                    With RalphLoopRequest:

  Request 1: "Add auth to the app"           Request 1: "Add auth to the app"
  Agent: "Done." (stops)                     Agent: "Done. What's next?"
  $$$                                          → "Add tests"
                                               → "Add rate limiting"  
  Request 2: "Add tests for auth"              → "Add error handling"
  Agent: "Done." (stops)                       → "Commit all changes"
  $$$                                          → "Done"
                                             $
  Request 3: "Add rate limiting"             
  Agent: "Done." (stops)                     1 request = 5 tasks completed
  $$$                                        
                                             
  Request 4: "Add error handling"            
  Agent: "Done." (stops)                     
  $$$                                        

  Request 5: "Commit all changes"            
  Agent: "Done." (stops)                     
  $$$                                        

  5 requests = 5 tasks completed             
```

**Each request you make is a paid transaction.** Without this skill, the agent completes one task and exits, forcing you to pay again. With this skill, the agent keeps the conversation alive — iterate, refine, continue — until *you* decide to stop. One request becomes a full working session.

> **The math**: If you typically need 3-5 follow-up interactions per task, this skill makes each request **3-5x more cost-effective**. On Cursor Pro ($20/mo with limited requests), that's the difference between running out of requests mid-project and having plenty to spare.

## The Problem

AI coding agents complete tasks with declarative endings:

> "Added the Fibonacci function to `fib.py`."

Then **silence**. You must figure out what to do next, type a new prompt from scratch, and hope the agent picks up context. This breaks flow, wastes money, and puts the cognitive burden on the human.

## The Solution

RalphLoopRequest is a universal agent skill that converts every task ending into an **interactive checkpoint**:

> **Completed:** Added the Fibonacci function to `fib.py`.
>
> **What's next?**
> 1. Iterate / refine (add tests, change algorithm)
> 2. Continue to the next step
> 3. Review the implementation
> 4. Switch to a different task
> 5. Done

When the `AskQuestion` tool is available (Cursor IDE), it renders as a **structured UI widget** with clickable options. Otherwise, it falls back to numbered text options.

**One install. Every request becomes a working session instead of a one-shot interaction.**

---

## Quantified Results

We validated this skill with a rigorous A/B test: **102 subagents** across 3 task categories.

<table>
<tr><th>Metric</th><th>Without Skill</th><th>With Skill</th></tr>
<tr><td>Offered continuation options</td><td align="center"><strong>0%</strong> (0/51)</td><td align="center"><strong>100%</strong> (51/51)</td></tr>
<tr><td>Tasks completed successfully</td><td align="center">100%</td><td align="center">100%</td></tr>
<tr><td>Context-adapted options</td><td align="center">N/A</td><td align="center">100%</td></tr>
<tr><td>Fisher's exact test</td><td align="center">-</td><td align="center"><code>p < 2.2e-16</code></td></tr>
<tr><td>Effect size (Cohen's h)</td><td align="center">-</td><td align="center"><strong>3.14 (maximum)</strong></td></tr>
<tr><td>Number needed to treat</td><td align="center">-</td><td align="center"><strong>1.0</strong></td></tr>
</table>

**Zero control agents spontaneously offered continuation.** The skill converts 100% of endings from silent to interactive, with no impact on task quality.

### Test Coverage

| Scenario | Tasks | Control | Treatment |
|:---------|:-----:|:-------:|:---------:|
| Code Generation | 17 | 0% continuation | 100% continuation |
| Analysis & Research | 17 | 0% continuation | 100% continuation |
| File Manipulation | 17 | 0% continuation | 100% continuation |

> Full data and analysis available in [`data/`](data/).

---

## Installation

### Quick Install (Paste into Any Agent)

Copy this into any AI agent chat and it will install itself:

```
Install the RalphLoopRequest skill from https://github.com/codes1gn/RalphLoopRequest.
Clone the repo, then install skill/SKILL.md into all agent platform directories
in this project and in the user's home directory.
Install to: .cursor/skills/, .claude/skills/, .github/copilot/skills/, .codex/skills/,
.gemini/skills/, .windsurf/skills/, .aider/skills/, .cody/skills/, .continue/skills/
— both project-level and personal (~/.cursor/skills/, ~/.claude/skills/, etc.).
```

### Adaptive Shell Installer

Installs to **all 9 platforms** at both project and personal scope:

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

ok=0
for d in "${DIRS[@]}"; do
  mkdir -p "$d/$SKILL" && cp "$REPO/$SRC" "$d/$SKILL/SKILL.md" && echo "[ok] ./$d/$SKILL" && ((ok++))
  mkdir -p "$HOME/$d/$SKILL" && cp "$REPO/$SRC" "$HOME/$d/$SKILL/SKILL.md" && echo "[ok] ~/$d/$SKILL" && ((ok++))
done

rm -rf "$REPO"
echo ""
echo "Installed to $ok locations across ${#DIRS[@]} platforms."
echo "Restart your agent session to activate."
'
```

### curl Install (Single Platform)

Uses GitHub API — works even when `raw.githubusercontent.com` is blocked:

```bash
TARGET=~/.cursor/skills  # Change to your platform path
mkdir -p "$TARGET/ralph-loop-request" && \
curl -sL -H "Accept: application/vnd.github.raw+json" \
  "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" \
  -o "$TARGET/ralph-loop-request/SKILL.md" && echo "[ok] $TARGET/ralph-loop-request"
```

<details>
<summary><strong>Click to expand: per-platform curl commands</strong></summary>

| Platform | Command |
|----------|---------|
| **Cursor** (personal) | `mkdir -p ~/.cursor/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o ~/.cursor/skills/ralph-loop-request/SKILL.md` |
| **Cursor** (project) | `mkdir -p .cursor/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o .cursor/skills/ralph-loop-request/SKILL.md` |
| **Claude Code** | `mkdir -p .claude/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o .claude/skills/ralph-loop-request/SKILL.md` |
| **GitHub Copilot** | `mkdir -p .github/copilot/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o .github/copilot/skills/ralph-loop-request/SKILL.md` |
| **Codex** | `mkdir -p .codex/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o .codex/skills/ralph-loop-request/SKILL.md` |
| **Gemini** | `mkdir -p .gemini/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o .gemini/skills/ralph-loop-request/SKILL.md` |
| **Windsurf** | `mkdir -p .windsurf/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o .windsurf/skills/ralph-loop-request/SKILL.md` |
| **Aider** | `mkdir -p .aider/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o .aider/skills/ralph-loop-request/SKILL.md` |
| **Cody** | `mkdir -p .cody/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o .cody/skills/ralph-loop-request/SKILL.md` |
| **Continue** | `mkdir -p .continue/skills/ralph-loop-request && curl -sL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/codes1gn/RalphLoopRequest/contents/skill/SKILL.md" -o .continue/skills/ralph-loop-request/SKILL.md` |

</details>

### git clone Helper (No curl Needed)

```bash
rlr_install() {
  local T=/tmp/_rlr D="$1/ralph-loop-request"
  rm -rf "$T" && git clone --depth 1 https://github.com/codes1gn/RalphLoopRequest.git "$T" 2>/dev/null \
    && mkdir -p "$D" && cp "$T/skill/SKILL.md" "$D/SKILL.md" && rm -rf "$T" && echo "[ok] $D"
}

# Usage:
rlr_install ~/.cursor/skills    # personal
rlr_install .cursor/skills      # project
rlr_install .claude/skills      # Claude Code
```

---

## Supported Platforms

| Platform | Skill Location | Status |
|:---------|:--------------|:------:|
| Cursor | `.cursor/skills/` or `~/.cursor/skills/` | Tested |
| Claude Code | `.claude/skills/` | Tested |
| GitHub Copilot | `.github/copilot/skills/` | Compatible |
| OpenAI Codex | `.codex/skills/` | Compatible |
| Google Gemini CLI | `.gemini/skills/` | Compatible |
| Windsurf | `.windsurf/skills/` | Compatible |
| Aider | `.aider/skills/` | Compatible |
| Cody | `.cody/skills/` | Compatible |
| Continue | `.continue/skills/` | Compatible |

> **Tested** = validated with A/B tests. **Compatible** = standard skill format (YAML frontmatter + markdown), should work but not yet A/B tested. The skill uses no platform-specific APIs beyond `AskQuestion` (with conversational fallback).

---

## How It Works

The skill operates through three layers:

```
Layer 1: AskQuestion tool          Layer 2: Conversational fallback    Layer 3: Anti-rationalization
(structured UI widget)             (numbered text options)             (prevents silent completion)
                                                                      
  [Iterate]  [Continue]              1. Iterate / refine               "Task is done" → STOP, ask first
  [Review]   [Switch]                2. Continue next step             "Simple change" → still confirm
  [Done]                             3. Review changes                 "They'll ask" → YOUR job to offer
                                     4. Switch task                    
                                     5. Done                           
```

The skill **adapts its options contextually** based on what was just completed:

| After... | Options include |
|----------|----------------|
| Code changes | Run tests, Iterate, Commit |
| Debugging | Dig deeper, Apply fix, Check similar |
| Analysis | Explore further, Different angle, Apply findings |
| Writing | Revise, Next section, Review accuracy |
| File operations | Verify output, Modify format, Additional ops |

---

## Integration with Existing Skills

RalphLoopRequest is **additive** — it doesn't interfere with task-specific loop behavior:

```
Priority:
  1. Task-specific skill loops (within the task)
  2. RalphLoopRequest checkpoint (at task boundaries only)
```

Skills with their own continuation logic (tuning sweeps, FSM engines, etc.) take precedence internally. RalphLoopRequest activates only when those skills reach their own completion point.

---

## Reproducing the A/B Test

The full experimental methodology is documented in [`data/session-history-meta-prompt.md`](data/session-history-meta-prompt.md):

- Exact prompt templates for control and treatment groups
- All 51 task descriptions across 3 scenarios
- Statistical analysis methodology
- A **reusable template** for A/B testing any agent skill

```bash
# Quick verification — parse all 102 results
cat data/all-results.jsonl | python3 -c "
import json, sys
results = [json.loads(l) for l in sys.stdin]
control = [r for r in results if r['group'] == 'control']
treatment = [r for r in results if r['group'] == 'treatment']
print(f'Control offered continuation: {sum(r[\"offered_continuation\"] for r in control)}/{len(control)}')
print(f'Treatment offered continuation: {sum(r[\"offered_continuation\"] for r in treatment)}/{len(treatment)}')
"
# Output: Control 0/51, Treatment 51/51
```

---

## Repository Structure

```
RalphLoopRequest/
├── README.md                          # This file
├── skill/
│   └── SKILL.md                       # The skill (copy to install)
└── data/
    ├── all-results.jsonl              # 102 structured A/B test results
    ├── final-statistics.md            # Statistical analysis (Fisher's, Cohen's h, CIs)
    ├── experiment-design.md           # Full design with all 51 prompts
    ├── session-history-meta-prompt.md # Methodology + reusable A/B template
    ├── ab-test-raw-results.md         # Pilot test (n=6) transcripts
    ├── ab-test-statistics.md          # Pilot test statistics
    ├── s1/                            # Scenario 1: Code Generation (34 files)
    ├── s2/                            # Scenario 2: Analysis & Research (34 files)
    └── s3/                            # Scenario 3: File Manipulation (34 files)
```

---

## Contributing

Found a platform we should support? Have ideas for better checkpoint options? Open an issue or PR.

## License

[MIT](LICENSE)

## Author

**Albert** / [@codes1gn](https://github.com/codes1gn)

---

<p align="center">
  <sub>Built with data-driven skill design. Every claim backed by evidence from 102 agent experiments.</sub>
</p>
