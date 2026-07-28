#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${ROOT}/build-wasm"
OUT_DIR="${ROOT}/../web/src/wasm"

# Homebrew emscripten needs a writable cache dir in sandboxes / CI.
export EM_CACHE="${ROOT}/.emscripten_cache"

mkdir -p "${OUT_DIR}"
emcmake cmake -S "${ROOT}" -B "${BUILD_DIR}"
cmake --build "${BUILD_DIR}"

echo "WASM build written to ${OUT_DIR}"
ls -la "${OUT_DIR}"
