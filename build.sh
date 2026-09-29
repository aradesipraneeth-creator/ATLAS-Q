#!/usr/bin/env bash
# Exit on error
set -o errexit

echo ">>> Building ATLAS-Q Frontend..."
cd frontend
npm install
npm run build
cd ..

echo ">>> Installing Python Backend Dependencies..."
pip install -r requirements.txt

echo ">>> Build Complete! Starting ATLAS-Q..."
