# Python Programming Quiz Portal

This is a web-based learning portal for college computer science students to practice Python programming concepts. The portal generates quiz questions similar to college CS exams, with AI-powered validation and explanations.

## Features

### Question Types
The app generates diverse question types aligned with college CS exam formats:

1. **Multiple Choice** - Test understanding of syntax and definitions
2. **Code Comprehension** - Analyze given code and predict behavior
3. **Function Writing** - Implement functions with specific requirements
4. **Recursion Tracing** - Understand recursive execution and call patterns
5. **Output Prediction** - Determine what code will output
6. **Input Specification** - Provide inputs that produce specific outputs
7. **Fill-in-the-Blank** - Complete code snippets
8. **True/False** - Verify understanding of concepts
9. **Conceptual Questions** - Explain how Python features work

### Interactive Features
- **Topic Management** - Add, delete, and view explanations for topics
- **AI Validation** - Automatic answer checking with detailed feedback
- **ELI5 Mode** - Get simplified explanations for complex concepts
- **Chat Feature** - Ask follow-up questions about any quiz question
- **Score Tracking** - Monitor correct/incorrect answers
- **Markdown Formatting** - Beautiful code display with syntax highlighting

## Setup and Running the Application

1.  **Install Dependencies**:
    Make sure you have Python 3 installed. It is recommended to use a virtual environment.

    ```bash
    # Create virtual environment (if not already created)
    python3 -m venv .venv
    
    # Activate virtual environment
    source .venv/bin/activate  # On Linux/Mac
    # OR
    .venv\Scripts\activate  # On Windows
    
    # Install dependencies
    pip install -r requirements.txt
    ```

2.  **Set up Environment Variables**:
    Create a `.env` file in the root of the project and add your OpenAI API key:

    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

3.  **Run the Application**:
    
    **Option A - Using the run script (recommended):**
    ```bash
    ./run.sh
    ```
    
    **Option B - Manual activation:**
    ```bash
    # Activate virtual environment first
    source .venv/bin/activate  # On Linux/Mac
    # OR
    .venv\Scripts\activate  # On Windows
    
    # Then run the app
    python app.py
    ```

    The application will be available at `http://127.0.0.1:5000`.

## Deployment to Render

Want to deploy this app to the cloud? Check out:
- **[Quick Deployment Guide](DEPLOY_QUICK.md)** - 5-minute setup
- **[Detailed Deployment Guide](DEPLOYMENT.md)** - Full documentation

Your app will be live at: `https://your-app-name.onrender.com`

