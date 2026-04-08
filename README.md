<p align="center">
  <h1 align="center">durable-request</h1>
  <p align="center">
    <strong>Get more out of every AI agent request.</strong>
  </p>
</p>

<p align="center">
  <a href="https://git.enflame.cn/heng.shi/DurableRequest/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://git.enflame.cn/heng.shi/DurableRequest"><img alt="Stars" src="https://img.shields.io/badge/Stars-0-blue"></a>
  <a href="https://git.enflame.cn/heng.shi/DurableRequest/-/issues"><img alt="Issues" src="https://img.shields.io/badge/Issues-0-red"></a>
</p>

<p align="center">
  <a href="#why">Why</a> &bull;
  <a href="#installation">Install</a> &bull;
  <a href="#quantified-results">Results</a> &bull;
  <a href="#how-it-works">How It Works</a> &bull;
  <a href="#supported-platforms">Platforms</a> &bull;
  <a href="#reproducing-the-ab-test">Reproduce</a>
</p>

---

## Why

Agent requests cost money. On Cursor, Claude, Copilot, or any usage-based plan, each request is a paid interaction. Without this skill, the agent finishes one task and stops — you have to start a new request to keep going.

```
Without this skill:                         With this skill:

  Request 1: "Add auth"                     Request 1: "Add auth"
  Agent: "Done."                            Agent: "Done. What's next?"
                                              → "Add tests"
  Request 2: "Add tests"                      → "Add rate limiting"
  Agent: "Done."                              → "Handle errors"
                                              → "Commit"
  Request 3: "Rate limiting"                  → "Done"
  Agent: "Done."
                                            1 request, 5 things done.
  Request 4: "Handle errors"
  Agent: "Done."

  Request 5: "Commit"
  Agent: "Done."

  5 requests, 5 things done.
```

With durable-request installed, the agent asks what to do next instead of stopping. You stay in the same session, keep the context, and get more done per request.

## What It Does

After finishing any task, the agent presents options instead of going silent:

> **Completed:** Added the Fibonacci function to `fib.py`.
>
> **What's next?**
> 1. Iterate / refine (add tests, change algorithm)
> 2. Continue to the next step
> 3. Review the implementation
> 4. Switch to a different task
> 5. Done

In Cursor, this shows up as a clickable UI widget (via `AskQuestion`). In CLI tools, it's numbered text options. Either way, the agent waits for you instead of disappearing.

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

### For Agents (Recommended)

Paste this into any AI agent chat — it will install itself:

```
Install durable-request by following the instructions at:
https://git.enflame.cn/heng.shi/DurableRequest/-/raw/main/install.md
```

The agent fetches the install guide and handles everything: downloading the skill file, creating directories, and copying to all 9 platform locations at both project and personal scope.

### Manual (Single Platform)

```bash
mkdir -p ~/.cursor/skills/durable-request && \
curl -sL "https://git.enflame.cn/heng.shi/DurableRequest/-/raw/main/skill/SKILL.md" \
  -o ~/.cursor/skills/durable-request/SKILL.md
```

Change the target path for your platform — see [install.md](install.md) for all platform paths.

---

## Supported Platforms

| Platform | Skill Location | Status |
|:---------|:--------------|:------:|
| Cursor | `.cursor/skills/` or `~/.cursor/skills/` | Tested |
| Claude Code | `.claude/skills/` | Tested |
| OpenCode | `.skills/` | Compatible but not tested |
| GitHub Copilot | `.github/copilot/skills/` | Compatible but not tested |
| OpenAI Codex | `.codex/skills/` | Compatible but not tested |
| Google Gemini CLI | `.gemini/skills/` | Compatible but not tested |
| Windsurf | `.windsurf/skills/` | Compatible but not tested |
| Aider | `.aider/skills/` | Compatible but not tested |
| Cody | `.cody/skills/` | Compatible but not tested |
| Continue | `.continue/skills/` | Compatible but not tested |

> **Tested** = validated with A/B tests. **Compatible but not tested** = standard skill format (YAML frontmatter + markdown), should work but not yet A/B tested.

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

durable-request is **additive** — it doesn't interfere with task-specific loop behavior:

```
Priority:
  1. Task-specific skill loops (within the task)
  2. durable-request checkpoint (at task boundaries only)
```

Skills with their own continuation logic (tuning sweeps, FSM engines, etc.) take precedence internally. durable-request activates only when those skills reach their own completion point.

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
durable-request/
├── README.md                          # This file
├── install.md                         # LLM-readable installation guide
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

**heng.shi** / [@heng.shi](https://git.enflame.cn/heng.shi)

---

<p align="center">
  <sub>Built with data-driven skill design. Every claim backed by evidence from 102 agent experiments.</sub>
</p>
