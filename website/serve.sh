#!/usr/bin/env bash
set -euo pipefail

# Durable Request Website — Internal LAN Server
# Serves the built website on all LAN interfaces (0.0.0.0).
# Does NOT expose to public internet — only reachable from the local network.
#
# Usage:
#   ./serve.sh              # default port 8080
#   ./serve.sh 3000         # custom port
#   PORT=3000 ./serve.sh    # via env var
#
# As a systemd service:
#   sudo cp durable-request-web.service /etc/systemd/system/
#   sudo systemctl daemon-reload
#   sudo systemctl enable --now durable-request-web

PORT="${1:-${PORT:-8080}}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$SCRIPT_DIR/dist"

if [ ! -d "$DIST_DIR" ]; then
  echo "[durable-request] dist/ not found. Building..."
  cd "$SCRIPT_DIR"
  npm run build
fi

echo "[durable-request] Serving on http://0.0.0.0:$PORT (LAN only)"
echo "[durable-request] Access from other machines: http://$(hostname -I | awk '{print $1}'):$PORT/durable-request/"

exec python3 -m http.server "$PORT" --directory "$DIST_DIR" --bind 0.0.0.0
