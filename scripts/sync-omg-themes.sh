#!/bin/sh
# Copies the shared omg-themes files (core, densities, the three themes and
# omg.js) into this project.
#
# Usage: sh scripts/sync-omg-themes.sh [path/to/omg-themes]
#        (default: ../omg-themes next to this project)
#
# Don't edit the synced files here. Put project-specific tweaks in the
# project's own stylesheets (html[data-theme="dark"] etc. for per-theme rules)
# and fix shared things in omg-themes itself.
set -e
here="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$(cd "${1:-$here/../omg-themes}" 2>/dev/null && pwd)" || {
  echo "omg-themes not found (pass its path as first argument)" >&2
  exit 1
}
cd "$here"
for f in \
  css/core.css css/densities.css js/omg.js \
  css/themes/dark/dark.css css/themes/dark/bg0.png \
  css/themes/light/light.css css/themes/light/bg0.png \
  css/themes/evol-blue/evol-blue.css css/themes/evol-blue/spirals.png; do
  mkdir -p "$(dirname "$f")"
  cp "$SRC/$f" "$f"
  echo "synced $f"
done
