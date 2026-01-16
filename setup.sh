#!/bin/bash

# Frontend Setup Script for Document Management & Extraction App
# This script installs Node.js and sets up the React frontend

set -e

echo "======================================"
echo "Frontend Setup - Document Management"
echo "======================================"
echo ""

# Check if Node.js is already installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✓ Node.js is already installed: $NODE_VERSION"
else
    echo "Installing Node.js..."
    
    # Install Node.js using NodeSource repository (recommended method)
    if [ -f /etc/redhat-release ]; then
        # RHEL/CentOS/Fedora
        echo "Detected RHEL-based system"
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs
    elif [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        echo "Detected Debian-based system"
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "Please install Node.js manually from: https://nodejs.org/"
        exit 1
    fi
    
    echo "✓ Node.js installed successfully"
fi

# Verify installation
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo ""
echo "Node.js version: $NODE_VERSION"
echo "npm version: $NPM_VERSION"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing npm dependencies..."
npm install

echo ""
echo "======================================"
echo "✓ Setup Complete!"
echo "======================================"
echo ""
echo "To start the development server:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "The app will be available at: http://localhost:3000"
echo "Make sure your FastAPI backend is running on http://localhost:8000"
echo ""
