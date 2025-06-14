SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

PUBLIC_DIR="$SCRIPT_DIR/../public"

magick "$PUBLIC_DIR/icon.png" "$PUBLIC_DIR/icon@2x.png" "$PUBLIC_DIR/favicon.ico"

