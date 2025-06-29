SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

curl "https://netrunnerdb.com/api/2.0/public/cycles" > "$SCRIPT_DIR/../src/data/json/cycles.json"
curl "https://netrunnerdb.com/api/2.0/public/packs" > "$SCRIPT_DIR/../src/data/json/packs.json"
curl "https://netrunnerdb.com/api/2.0/public/cards" > "$SCRIPT_DIR/../src/data/json/cards.json"

