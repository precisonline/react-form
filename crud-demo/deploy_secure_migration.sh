#!/bin/bash

# This script securely deploys a single database migration that contains a secret placeholder.
# It reads the secret from the .env file, injects it into the SQL,
# and executes it against the remote database without ever committing the secret to git.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# The path to the migration file that contains the placeholder.
# IMPORTANT: Make sure this filename matches your actual migration file.
MIGRATION_FILE="supabase/migrations/20250612200549_create_tenant_provisioning_function.sql"


# --- Script Body ---
echo "🚀 Starting secure deployment of migration: $MIGRATION_FILE"

# Step 1: Load environment variables from the root .env file if it exists.
if [ -f .env ]; then
  echo "Found .env file. Loading environment variables..."
  # This command exports the variables from the .env file into the current shell session.
  # It ignores comments and handles various formats.
  export $(grep -v '^#' .env | xargs)
else
  echo "Warning: .env file not found. Assuming environment variables are already set."
fi

# Step 2: Check that the required secrets have been loaded into the environment.
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ -z "$DATABASE_URI" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY or DATABASE_URI is not set."
    echo "Please ensure they are defined in your .env file or exported in your shell."
    exit 1
fi

echo "✅ Secrets loaded successfully."

# Step 3: Read the migration file, replace the placeholder with the real secret,
# and then pipe the resulting SQL directly to psql for execution.
# This is secure because the secret only exists in memory and is never written to disk.
echo "Applying migration to remote database..."
sed "s/@@SUPABASE_SERVICE_ROLE_KEY@@/$SUPABASE_SERVICE_ROLE_KEY/g" "$MIGRATION_FILE" | psql "$DATABASE_URI"

echo "🎉 Secure migration applied successfully!"