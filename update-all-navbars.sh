#!/bin/bash

# Script to update navbar in all pages
# This will add the premium glassmorphism navbar to all product pages

echo "🚀 Starting navbar update for all pages..."

# List of pages to update
pages=(
  "public/pages/bulk-sms.html"
  "public/pages/whatsapp-api.html"
  "public/pages/google-rcs.html"
  "public/pages/voice-ivr.html"
  "public/pages/email-marketing.html"
)

# Backup directory
backup_dir="navbar_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"

echo "📦 Creating backups in $backup_dir..."

# Backup all files first
for page in "${pages[@]}"; do
  if [ -f "$page" ]; then
    cp "$page" "$backup_dir/"
    echo "  ✓ Backed up: $page"
  fi
done

echo ""
echo "✅ Backups created successfully!"
echo ""
echo "📝 Manual steps required:"
echo ""
echo "For each page in public/pages/, you need to:"
echo "1. Add this line in <head> after site.css:"
echo "   <link rel=\"stylesheet\" href=\"/assets/css/navbar-glassmorphism.css\">"
echo ""
echo "2. Replace old <nav class=\"nav\">...</nav> with the navbar from:"
echo "   public/includes/navbar-complete.html"
echo ""
echo "3. Add this line before </body>:"
echo "   <script src=\"/assets/js/navbar-glassmorphism.js\"></script>"
echo ""
echo "📄 Pages to update:"
for page in "${pages[@]}"; do
  echo "  - $page"
done
echo ""
echo "💡 Tip: Open public/includes/navbar-complete.html for the complete navbar code"
echo ""
echo "✨ Done! Backups are in: $backup_dir"
