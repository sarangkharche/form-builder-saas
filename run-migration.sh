#!/bin/bash

echo "🚀 Running Supabase Migration"
echo "=============================="
echo ""

# Your Supabase connection details
SUPABASE_URL="https://lfjgvesudjbdmchrulsm.supabase.co"
SUPABASE_DB_URL="postgresql://postgres:!A123456ab@db.lfjgvesudjbdmchrulsm.supabase.co:5432/postgres"

echo "📍 Project: lfjgvesudjbdmchrulsm"
echo "📍 URL: $SUPABASE_URL"
echo ""

# Check if we have the migration file
if [ ! -f "supabase/migrations/001_create_forms_tables.sql" ]; then
    echo "❌ Migration file not found!"
    exit 1
fi

echo "✅ Migration file found"
echo ""
echo "To run the migration, you have two options:"
echo ""
echo "Option 1: Via Supabase Dashboard (RECOMMENDED)"
echo "=============================================="
echo "1. Go to: https://app.supabase.com/project/lfjgvesudjbdmchrulsm/editor"
echo "2. Click 'SQL Editor' in the left sidebar"
echo "3. Click 'New Query'"
echo "4. Copy and paste the entire contents of:"
echo "   supabase/migrations/001_create_forms_tables.sql"
echo "5. Click 'Run' button"
echo ""
echo "Option 2: Via psql command line"
echo "================================"
echo "If you have PostgreSQL installed:"
echo ""
echo "PGPASSWORD='!A123456ab' psql -h db.lfjgvesudjbdmchrulsm.supabase.co -U postgres -d postgres -p 5432 -f supabase/migrations/001_create_forms_tables.sql"
echo ""
echo "If you don't have psql, install it:"
echo "- macOS: brew install postgresql"
echo "- Ubuntu: sudo apt-get install postgresql-client"
echo ""

# Try to run with psql if available
if command -v psql &> /dev/null; then
    echo "✅ psql found! Running migration..."
    echo ""
    PGPASSWORD='!A123456ab' psql -h db.lfjgvesudjbdmchrulsm.supabase.co -U postgres -d postgres -p 5432 -f supabase/migrations/001_create_forms_tables.sql

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Migration completed successfully!"
    else
        echo ""
        echo "❌ Migration failed. Please run manually via Supabase Dashboard."
    fi
else
    echo "⚠️  psql not found. Please use Option 1 (Supabase Dashboard)"
fi

echo ""
echo "Next steps:"
echo "1. Get your Supabase anon key from:"
echo "   https://app.supabase.com/project/lfjgvesudjbdmchrulsm/settings/api"
echo "2. Add environment variables to Vercel"
echo "3. Configure Update.dev"
echo ""
