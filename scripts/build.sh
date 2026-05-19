#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEMO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT_DIR="$(cd "${DEMO_DIR}/.." && pwd)"
COMPONENT_VERSION="0.1.11"
PORT="18080"

"${ROOT_DIR}/gradlew" :thoth-biblios:fatJar -PinterlisLabVersion="${COMPONENT_VERSION}"

JAR_PATH="$(find "${ROOT_DIR}/thoth-biblios/build/libs" -maxdepth 1 -type f -name 'thoth-biblios-*-all.jar' | sort | tail -n 1)"
if [[ -z "${JAR_PATH}" ]]; then
  echo "Konnte thoth-biblios Fat-JAR nicht finden." >&2
  exit 1
fi

rm -rf "${DEMO_DIR}/build/site"
LOG_FILE="$(mktemp)"

java -jar "${JAR_PATH}" serve \
  --config "${DEMO_DIR}/biblios.yml" \
  --use-local-working-tree \
  --port "${PORT}" \
  "$@" \
  >"${LOG_FILE}" 2>&1 &

SERVER_PID=$!
cleanup() {
  kill "${SERVER_PID}" 2>/dev/null || true
  wait "${SERVER_PID}" 2>/dev/null || true
  rm -f "${LOG_FILE}"
}
trap cleanup EXIT

for _ in $(seq 1 60); do
  if [[ -f "${DEMO_DIR}/build/site/index.html" ]]; then
    sleep 1
    echo "HTML-Snapshot erzeugt: ${DEMO_DIR}/build/site/index.html"
    exit 0
  fi
  if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
    cat "${LOG_FILE}" >&2
    echo "Biblios-Serve-Prozess wurde vorzeitig beendet." >&2
    exit 1
  fi
  sleep 1
done

cat "${LOG_FILE}" >&2
echo "Timeout: build/site/index.html wurde nicht rechtzeitig erzeugt." >&2
exit 1
