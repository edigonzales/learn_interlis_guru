#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEMO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT_DIR="$(cd "${DEMO_DIR}/.." && pwd)"
COMPONENT_VERSION="0.1.11"
PORT="${1:-8080}"

if [[ $# -gt 0 ]]; then
  shift
fi

"${ROOT_DIR}/gradlew" :thoth-biblios:fatJar -PinterlisLabVersion="${COMPONENT_VERSION}"

JAR_PATH="$(find "${ROOT_DIR}/thoth-biblios/build/libs" -maxdepth 1 -type f -name 'thoth-biblios-*-all.jar' | sort | tail -n 1)"
if [[ -z "${JAR_PATH}" ]]; then
  echo "Konnte thoth-biblios Fat-JAR nicht finden." >&2
  exit 1
fi

java -jar "${JAR_PATH}" serve \
  --config "${DEMO_DIR}/biblios.yml" \
  --use-local-working-tree \
  --port "${PORT}" \
  "$@"
