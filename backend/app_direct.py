#!/usr/bin/env python3
"""Direct Flask app startup - minimal dependencies check"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # Try importing app
    from app import app
    
    print("✅ App imported successfully")
    print(f"🚀 Starting Flask on http://localhost:5000")
    print("=" * 50)
    
    # Start the app
    app.run(debug=False, host='0.0.0.0', port=5000)
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
