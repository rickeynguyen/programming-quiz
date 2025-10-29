#!/bin/bash

# Activate virtual environment
source .venv/bin/activate

# Install/update dependencies
pip install -r requirements.txt

# Run Flask app
python app.py
