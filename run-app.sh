# #!/usr/bin/env bash
# set -o errexit
# set -o nounset
# set -o pipefail

# timestamp() { date --iso-8601=seconds 2>/dev/null || date; }
# log() { printf '%s %s\n' "[$(timestamp)]" "$*"; }

# run_cmd() {
#   local desc="$1"; shift
#   log "START: $desc"
#   if "$@"; then
#     log "OK: $desc"
#   else
#     local code=$?
#     log "ERROR: $desc (exit $code)"
#     exit $code
#   fi
# }

# # ตัวแปรบอกว่าเรา start container เองหรือเปล่า (ไว้เช็คก่อน stop)
# CONTAINER_STARTED_BY_SCRIPT=false

# cleanup() {
#   local exit_code=$?
#   log "Cleanup: stopping sqlserver container..."
#   if [ "$CONTAINER_STARTED_BY_SCRIPT" = true ]; then
#     if docker stop sqlserver >/dev/null 2>&1; then
#       log "OK: sqlserver container stopped"
#     else
#       log "WARNING: failed to stop sqlserver container (may already be stopped)"
#     fi
#   fi
#   log "========== END SETUP MIGRATION (exit $exit_code) =========="
# }

# # ดักทุกกรณีที่สคริปต์จะจบ: ปกติ, error, Ctrl+C, kill
# trap cleanup EXIT INT TERM

# log "========== START SETUP MIGRATION =========="

# run_cmd "Start docker containers" docker start sqlserver
# CONTAINER_STARTED_BY_SCRIPT=true

# log "Waiting for SQL Server..."

# MAX_WAIT=30
# elapsed=0
# until docker logs sqlserver 2>&1 | grep "SQL Server is now ready for client connections" >/dev/null; do
#   if [ "$elapsed" -ge "$MAX_WAIT" ]; then
#     log "ERROR: SQL Server not ready after ${MAX_WAIT}s, giving up"
#     docker logs --tail 50 sqlserver
#     exit 1
#   fi
#   sleep 5
#   elapsed=$((elapsed + 5))
# done

# log "SQL Server ready"

# # npm run dev จะบล็อกอยู่ตรงนี้จนกว่าจะกด Ctrl+C หรือ process ถูกปิด
# run_cmd "Start web application" npm run dev

# log "Setup completed successfully"

#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

timestamp() { date --iso-8601=seconds 2>/dev/null || date; }
log() { printf '%s %s\n' "[$(timestamp)]" "$*"; }

run_cmd() {
  local desc="$1"; shift
  log "START: $desc"
  if "$@"; then
    log "OK: $desc"
  else
    local code=$?
    log "ERROR: $desc (exit $code)"
    exit $code
  fi
}

CONTAINER_STARTED_BY_SCRIPT=false
CLEANUP_DONE=false   # guard กันไม่ให้ cleanup ทำงานซ้ำ

cleanup() {
  local exit_code=$?

  # กันไม่ให้ cleanup ทำงานซ้ำ ไม่ว่าจะถูกเรียกจากสาเหตุอะไรก็ตาม
  if [ "$CLEANUP_DONE" = true ]; then
    return 0
  fi
  CLEANUP_DONE=true

  log "Cleanup: stopping sqlserver container..."
  if [ "$CONTAINER_STARTED_BY_SCRIPT" = true ]; then
    if docker stop sqlserver >/dev/null 2>&1; then
      log "OK: sqlserver container stopped"
    else
      log "WARNING: failed to stop sqlserver container (may already be stopped)"
    fi
  fi
  log "========== END SETUP MIGRATION (exit $exit_code) =========="
}

trap cleanup EXIT INT TERM

log "========== START SETUP MIGRATION =========="

run_cmd "Start docker containers" docker start sqlserver
CONTAINER_STARTED_BY_SCRIPT=true

log "Waiting for SQL Server..."

MAX_WAIT=30
elapsed=0

# ใช้ temp file แทน pipe เพื่อไม่ให้เกิด subshell
LOG_TMPFILE=$(mktemp)

while :; do
  docker logs sqlserver > "$LOG_TMPFILE" 2>&1
  if grep -q "SQL Server is now ready for client connections" "$LOG_TMPFILE"; then
    break
  fi

  if [ "$elapsed" -ge "$MAX_WAIT" ]; then
    log "ERROR: SQL Server not ready after ${MAX_WAIT}s, giving up"
    tail -n 50 "$LOG_TMPFILE"
    rm -f "$LOG_TMPFILE"
    exit 1
  fi
  sleep 5
  elapsed=$((elapsed + 5))
done

rm -f "$LOG_TMPFILE"
log "SQL Server ready"

run_cmd "Start web application" npm run dev

log "Setup completed successfully"