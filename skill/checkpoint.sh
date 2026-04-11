#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# durable-request checkpoint — interactive CLI checkpoint tool
#
# Suspends the Cursor CLI TUI, presents an interactive question on the real
# terminal, captures the user's choice, resumes Cursor, and prints the
# answer to stdout (where the agent reads it).
#
# Usage:
#   checkpoint.sh "What would you like to do next?" \
#                 "Run tests" "Iterate" "Review diff" "Done"
#
# The first argument is the prompt. All subsequent arguments are options.
# The script always appends a freeform "Type your own instruction" option.
#
# File layout (self-contained in the skills folder):
#   .checkpoint-question   — serialized question (prompt + options)
#   .checkpoint-answer     — user's response
#   .checkpoint-lock       — present while waiting for user input
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
QUESTION_FILE="$SKILL_DIR/.checkpoint-question"
ANSWER_FILE="$SKILL_DIR/.checkpoint-answer"
LOCK_FILE="$SKILL_DIR/.checkpoint-lock"

PROMPT="${1:-What would you like to do next?}"
shift || true
OPTIONS=("$@")
OPTIONS+=("I'll type my own instruction")

NUM_OPTIONS=${#OPTIONS[@]}

cleanup() {
  rm -f "$LOCK_FILE" "$QUESTION_FILE"
  if [ -n "${CURSOR_PID:-}" ]; then
    kill -CONT "$CURSOR_PID" 2>/dev/null || true
  fi
  if [ -n "${SAVED_STTY:-}" ]; then
    stty "$SAVED_STTY" < /dev/tty 2>/dev/null || true
  fi
}
trap cleanup EXIT

# ── 1. Persist question to file ──────────────────────────────────────────
{
  echo "PROMPT=$PROMPT"
  for i in "${!OPTIONS[@]}"; do
    echo "OPTION_$i=${OPTIONS[$i]}"
  done
} > "$QUESTION_FILE"

touch "$LOCK_FILE"

# ── 2. Find and suspend Cursor Agent CLI TUI ─────────────────────────────
CURSOR_PID=""
for pid in $(pgrep -f 'cursor-agent' 2>/dev/null || true); do
  if [ "$pid" != "$$" ] && [ "$pid" != "$PPID" ]; then
    CURSOR_PID="$pid"
    break
  fi
done

if [ -z "$CURSOR_PID" ]; then
  for pid in $(pgrep -f 'cursor' 2>/dev/null | head -5); do
    cmdline=$(ps -o args= -p "$pid" 2>/dev/null || true)
    if echo "$cmdline" | grep -q 'agent\|cli'; then
      CURSOR_PID="$pid"
      break
    fi
  done
fi

SAVED_STTY=""
if [ -n "$CURSOR_PID" ]; then
  SAVED_STTY=$(stty -g < /dev/tty 2>/dev/null || true)
  kill -TSTP "$CURSOR_PID" 2>/dev/null || true
  sleep 0.3
  stty sane < /dev/tty 2>/dev/null || true
fi

# ── 3. Render interactive prompt on the real terminal ────────────────────
TTY="/dev/tty"
if [ ! -c "$TTY" ]; then
  echo "[durable-request] ERROR: /dev/tty not available. This tool must be run from a real terminal (Cursor CLI)."
  echo "[durable-request] Falling back to non-interactive mode."
  echo "${OPTIONS[0]}" > "$ANSWER_FILE"
  rm -f "$LOCK_FILE"
  echo "[durable-request] Auto-selected: ${OPTIONS[0]}"
  exit 0
fi

{
  echo ""
  echo "  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
  echo "  ┃  [durable-request] Checkpoint                           ┃"
  echo "  ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫"
  echo "  ┃                                                          ┃"
  printf "  ┃  %-56s ┃\n" "$PROMPT"
  echo "  ┃                                                          ┃"
  for i in "${!OPTIONS[@]}"; do
    NUM=$((i + 1))
    if [ "$NUM" -eq "$NUM_OPTIONS" ]; then
      printf "  ┃    \033[33m%d.\033[0m %-50s ┃\n" "$NUM" "${OPTIONS[$i]}"
    else
      printf "  ┃    \033[36m%d.\033[0m %-50s ┃\n" "$NUM" "${OPTIONS[$i]}"
    fi
  done
  echo "  ┃                                                          ┃"
  echo "  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
  echo ""
  echo -n "  Enter choice (number) or type freely: "
} > "$TTY"

read -r CHOICE < "$TTY"

# ── 4. Resolve choice ───────────────────────────────────────────────────
ANSWER=""
if [[ "$CHOICE" =~ ^[0-9]+$ ]] && [ "$CHOICE" -ge 1 ] && [ "$CHOICE" -le "$NUM_OPTIONS" ]; then
  IDX=$((CHOICE - 1))
  SELECTED="${OPTIONS[$IDX]}"
  if [ "$CHOICE" -eq "$NUM_OPTIONS" ]; then
    echo -n "  Type your instruction: " > "$TTY"
    read -r FREEFORM < "$TTY"
    ANSWER="$FREEFORM"
  else
    ANSWER="$SELECTED"
  fi
else
  ANSWER="$CHOICE"
fi

# ── 5. Persist answer ───────────────────────────────────────────────────
echo "$ANSWER" > "$ANSWER_FILE"
rm -f "$LOCK_FILE"

# ── 6. Resume Cursor TUI ────────────────────────────────────────────────
if [ -n "$CURSOR_PID" ]; then
  if [ -n "$SAVED_STTY" ]; then
    stty "$SAVED_STTY" < /dev/tty 2>/dev/null || true
  fi
  kill -CONT "$CURSOR_PID" 2>/dev/null || true
fi

echo "" > "$TTY" 2>/dev/null || true

# ── 7. Output to agent (stdout) ─────────────────────────────────────────
echo "[durable-request] User responded: $ANSWER"
