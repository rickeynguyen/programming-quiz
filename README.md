# Python Programming Test Portal

This is a web-based learning portal for college computer science students to practice Python programming concepts. The focus is on memorizing definitions and syntax through interactive, AI-generated quizzes.

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
