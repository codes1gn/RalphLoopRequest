#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# durable-request checkpoint — interactive CLI checkpoint via tmux split pane
#
# Called by the agent via the Shell tool. Creates a tmux split pane where
# the user selects their next action, then returns their choice to the agent.
#
# Usage:
#   checkpoint.sh "What would you like to do next?" \
#                 "Run tests" "Iterate" "Review diff" "Done"
#
# Requirements: tmux (cursor-agent must be running inside a tmux session)
#
# File protocol (self-contained in the skills folder):
#   .ckpt-question   — serialized question (prompt + options)
#   .ckpt-answer     — user's response (written by checkpoint-ui.sh)
#   .ckpt-lock       — present while waiting for user input
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
QUESTION_FILE="$SKILL_DIR/.ckpt-question"
ANSWER_FILE="$SKILL_DIR/.ckpt-answer"
LOCK_FILE="$SKILL_DIR/.ckpt-lock"
UI_SCRIPT="$SKILL_DIR/checkpoint-ui.sh"

PROMPT="${1:-What would you like to do next?}"
shift || true
OPTIONS=("$@")

if [ ${#OPTIONS[@]} -eq 0 ]; then
  OPTIONS=("Continue" "Done")
fi

OPTIONS+=("I'll type my own instruction")
NUM_OPTIONS=${#OPTIONS[@]}

cleanup() {
  rm -f "$LOCK_FILE" "$QUESTION_FILE"
}
trap cleanup EXIT

# ── 1. Serialize question to file ────────────────────────────────────────
rm -f "$ANSWER_FILE" "$QUESTION_FILE" "$LOCK_FILE"

{
  echo "$PROMPT"
  for opt in "${OPTIONS[@]}"; do
    echo "$opt"
  done
} > "$QUESTION_FILE"

touch "$LOCK_FILE"

# ── 2. Detect tmux and launch UI pane ────────────────────────────────────
find_tmux_session() {
  # Try to find the tmux session that owns cursor-agent
  local cursor_pid
  cursor_pid=$(pgrep -f 'cursor-agent|/agent ' 2>/dev/null | head -1 || true)
  if [ -z "$cursor_pid" ]; then
    return 1
  fi

  local cursor_tty
  cursor_tty=$(ps -o tty= -p "$cursor_pid" 2>/dev/null | tr -d ' ' || true)
  if [ -z "$cursor_tty" ] || [ "$cursor_tty" = "?" ]; then
    return 1
  fi

  # Find tmux session containing this tty
  tmux list-panes -a -F '#{pane_tty} #{session_name}:#{window_index}.#{pane_index}' 2>/dev/null \
    | grep "/dev/$cursor_tty" \
    | head -1 \
    | awk '{print $2}'
}

TMUX_TARGET=""

if [ -n "${TMUX:-}" ]; then
  # We're inside tmux — use current session
  TMUX_TARGET=$(tmux display-message -p '#{session_name}:#{window_index}' 2>/dev/null || true)
elif command -v tmux &>/dev/null; then
  TMUX_TARGET=$(find_tmux_session)
fi

if [ -n "$TMUX_TARGET" ]; then
  # Launch UI in a split pane (bottom, 12 lines)
  tmux split-window -t "$TMUX_TARGET" -v -l 12 \
    "bash '$UI_SCRIPT' '$SKILL_DIR'" 2>/dev/null || {
    echo "[durable-request] ERROR: Failed to create tmux split pane."
    echo "[durable-request] Falling back to non-interactive mode."
    echo "${OPTIONS[0]}" > "$ANSWER_FILE"
    rm -f "$LOCK_FILE"
    echo "[durable-request] Auto-selected: ${OPTIONS[0]}"
    exit 0
  }
else
  echo "[durable-request] ERROR: tmux session not found."
  echo "[durable-request] For CLI checkpoints, run cursor-agent inside tmux:"
  echo "[durable-request]   tmux new-session -- cursor-agent"
  echo "[durable-request] Or add this alias to ~/.bashrc:"
  echo "[durable-request]   alias cursor-agent='tmux new-session -A -s cursor -- cursor-agent'"
  echo "[durable-request] Falling back to non-interactive mode."
  echo "${OPTIONS[0]}" > "$ANSWER_FILE"
  rm -f "$LOCK_FILE"
  echo "[durable-request] Auto-selected: ${OPTIONS[0]}"
  exit 0
fi

# ── 3. Poll for answer ──────────────────────────────────────────────────
TIMEOUT=300  # 5 minutes max
ELAPSED=0

while [ -f "$LOCK_FILE" ] && [ "$ELAPSED" -lt "$TIMEOUT" ]; do
  sleep 0.5
  ELAPSED=$((ELAPSED + 1))
done

if [ ! -f "$ANSWER_FILE" ]; then
  echo "[durable-request] Timeout waiting for user response."
  echo "[durable-request] Auto-selected: ${OPTIONS[0]}"
  echo "${OPTIONS[0]}" > "$ANSWER_FILE"
fi

# ── 4. Read and return answer ────────────────────────────────────────────
ANSWER=$(cat "$ANSWER_FILE")
rm -f "$ANSWER_FILE" "$LOCK_FILE" "$QUESTION_FILE"

echo "[durable-request] User responded: $ANSWER"
