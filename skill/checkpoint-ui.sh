#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# durable-request checkpoint UI — runs inside a tmux split pane
#
# Reads the question from .ckpt-question, renders an interactive prompt,
# captures the user's choice, writes it to .ckpt-answer, and exits
# (which automatically closes the tmux pane).
#
# This script HAS a real TTY (tmux gives each pane its own pty).
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

SKILL_DIR="${1:?Usage: checkpoint-ui.sh <skill-dir>}"
QUESTION_FILE="$SKILL_DIR/.ckpt-question"
ANSWER_FILE="$SKILL_DIR/.ckpt-answer"
LOCK_FILE="$SKILL_DIR/.ckpt-lock"

if [ ! -f "$QUESTION_FILE" ]; then
  echo "[durable-request] No question file found. Exiting."
  rm -f "$LOCK_FILE"
  exit 1
fi

# Read question file: first line is prompt, rest are options
mapfile -t LINES < "$QUESTION_FILE"
PROMPT="${LINES[0]}"
OPTIONS=("${LINES[@]:1}")
NUM_OPTIONS=${#OPTIONS[@]}

# ── Render ───────────────────────────────────────────────────────────────
CYAN='\033[36m'
YELLOW='\033[33m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'
GREEN='\033[32m'

clear
echo ""
echo -e "  ${BOLD}━━━ [durable-request] Checkpoint ━━━${RESET}"
echo ""
echo -e "  ${BOLD}$PROMPT${RESET}"
echo ""
for i in "${!OPTIONS[@]}"; do
  NUM=$((i + 1))
  if [ "$NUM" -eq "$NUM_OPTIONS" ]; then
    echo -e "    ${YELLOW}${NUM}.${RESET} ${DIM}${OPTIONS[$i]}${RESET}"
  else
    echo -e "    ${CYAN}${NUM}.${RESET} ${OPTIONS[$i]}"
  fi
done
echo ""
echo -e "  ${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -ne "  ${GREEN}▶${RESET} Choice (number or text): "

read -r CHOICE

# ── Resolve choice ───────────────────────────────────────────────────────
ANSWER=""
if [[ "$CHOICE" =~ ^[0-9]+$ ]] && [ "$CHOICE" -ge 1 ] && [ "$CHOICE" -le "$NUM_OPTIONS" ]; then
  IDX=$((CHOICE - 1))
  SELECTED="${OPTIONS[$IDX]}"
  if [ "$CHOICE" -eq "$NUM_OPTIONS" ]; then
    echo -ne "  ${GREEN}▶${RESET} Type your instruction: "
    read -r FREEFORM
    ANSWER="$FREEFORM"
  else
    ANSWER="$SELECTED"
  fi
else
  ANSWER="$CHOICE"
fi

# ── Write answer and clean up ────────────────────────────────────────────
echo "$ANSWER" > "$ANSWER_FILE"
rm -f "$LOCK_FILE"

echo ""
echo -e "  ${GREEN}✓${RESET} Sent: ${BOLD}$ANSWER${RESET}"
sleep 0.5
# Pane auto-closes when this script exits
