#!/usr/bin/env python3
"""
Quick setup and test script for DataSense AI backend
"""

import sys
import subprocess

print("🚀 DataSense AI Backend Setup\n")

# Check Python version
print("1️⃣ Checking Python version...")
version = sys.version_info
if version.major < 3 or version.minor < 9:
    print(f"❌ Python 3.9+ required, found {version.major}.{version.minor}")
    sys.exit(1)
print(f"✅ Python {version.major}.{version.minor}.{version.micro}\n")

# Install dependencies
print("2️⃣ Installing dependencies...")
try:
    subprocess.run(
        [sys.executable, "-m", "pip", "install", "-r", "requirements.txt", "--quiet"],
        check=True
    )
    print("✅ All dependencies installed\n")
except subprocess.CalledProcessError:
    print("❌ Failed to install dependencies")
    sys.exit(1)

# Test imports
print("3️⃣ Testing imports...")
try:
    import flask
    import flask_cors
    import pandas
    import numpy
    import seaborn
    import matplotlib
    print("✅ All packages imported successfully\n")
except ImportError as e:
    print(f"❌ Import failed: {e}")
    sys.exit(1)

# Try to start app
print("4️⃣ Starting Flask app...")
print("💡 Flask will run on http://localhost:5000\n")
print("=" * 50)
print("🎉 Setup complete! Starting backend...\n")

try:
    from app import app
    app.run(debug=True, port=5000)
except Exception as e:
    print(f"❌ Error starting app: {e}")
    sys.exit(1)
