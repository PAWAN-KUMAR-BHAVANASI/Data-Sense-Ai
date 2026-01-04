#!/usr/bin/env bash
# DataSense AI - Quick Launch Script
# Usage: bash run.sh

echo "🚀 DataSense AI - Seaborn Dashboard"
echo "===================================="
echo ""
echo "Starting full-stack application..."
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Python
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.9+"
    exit 1
fi
echo "✅ Python found: $(python --version)"

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

echo ""
echo "🔧 Installing dependencies..."

# Install backend deps
cd backend
pip install -q -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend deps
npm install -q
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "=========================================="
echo "🎉 Ready to launch!"
echo "=========================================="
echo ""
echo "In two separate terminal windows, run:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && python run.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Test data available: sample_data.csv"
echo ""
echo "For guides, see:"
echo "  - QUICK_START.md (setup)"
echo "  - README_SEABORN.md (overview)"
echo "  - FULL_STACK_DEPLOYMENT.md (production)"
echo ""
