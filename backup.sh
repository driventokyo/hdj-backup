#!/bin/zsh
# Backup di fine lavoro HDJ: dump del database D1, copia nell'archivio privato R2 "hdj-backups", push del codice su GitHub (driventokyo/hdj-backup).
# Uso: ./backup.sh "descrizione"   (dalla cartella HIREDRIVERJAPAN)
set -e
cd "${0:A:h}/site"
F="../backups/hdj-data-$(date +%Y%m%d-%H%M).sql"
npx wrangler d1 export hdj-data --remote --output "$F" >/dev/null
npx wrangler r2 object put "hdj-backups/d1/$(basename $F)" --file "$F" --content-type text/plain --remote >/dev/null
echo "database: $(basename $F) salvato in locale e su R2"
cd ..
git add -A
git diff --cached --quiet || git commit -qm "${1:-backup}"
git push -q origin HEAD && echo "codice: push su GitHub fatto"
