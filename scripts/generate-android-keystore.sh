#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
KEYSTORE_PATH="$ROOT_DIR/android/app/upload-keystore.jks"
PROPERTIES_PATH="$ROOT_DIR/android/keystore.properties"

if [[ -f "$KEYSTORE_PATH" ]]; then
  echo "Keystore already exists at android/app/upload-keystore.jks"
  echo "Delete it first if you intentionally want to create a new one."
  exit 1
fi

echo "Generating Android upload keystore..."
echo "Choose a strong password and store it in a password manager."
echo "If you lose this keystore/password, you cannot update the Play Store app."
echo

keytool -genkeypair -v \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -keystore "$KEYSTORE_PATH" \
  -alias upload \
  -dname "CN=Shopping Cart, OU=Mobile, O=Shopping Cart, L=City, ST=State, C=US"

echo
read -r -s -p "Enter the store/key password you just set: " KEYSTORE_PASSWORD
echo

cat > "$PROPERTIES_PATH" <<EOF
storeFile=upload-keystore.jks
storePassword=$KEYSTORE_PASSWORD
keyAlias=upload
keyPassword=$KEYSTORE_PASSWORD
EOF

echo
echo "Created:"
echo "  - android/app/upload-keystore.jks"
echo "  - android/keystore.properties"
echo
echo "Both files are gitignored. Back them up securely."
