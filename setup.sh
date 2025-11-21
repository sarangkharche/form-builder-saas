#!/bin/bash

echo "🚀 Form Builder SaaS - Setup Script"
echo "=================================="
echo ""

# Check if .env.local exists and has values
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your configuration"
    exit 1
fi

# Check for required env vars
if ! grep -q "NEXT_PUBLIC_SUPABASE_URL=https://" .env.local; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_URL not configured in .env.local"
    echo ""
    echo "To get started:"
    echo "1. Go to https://app.supabase.com"
    echo "2. Create a new project"
    echo "3. Go to Settings > API"
    echo "4. Copy the URL and anon key to .env.local"
    echo ""
fi

if ! grep -q "NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY=" .env.local || grep -q "NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY=$" .env.local; then
    echo "⚠️  NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY not configured in .env.local"
    echo ""
    echo "To get started:"
    echo "1. Go to https://update.dev"
    echo "2. Create an account"
    echo "3. Get your publishable key from dashboard"
    echo "4. Add it to .env.local"
    echo ""
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env.local file with real values"
echo "2. Run the database migration in Supabase (see QUICK_START.md)"
echo "3. Run 'npm run dev' to start the development server"
echo ""
