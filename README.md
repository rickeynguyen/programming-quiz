# Python Programming Test Portal

This is a web-based learning portal for college computer science students to practice Python programming concepts. The focus is on memorizing definitions and syntax through interactive, AI-generated quizzes.

## Setup and Running the Application

1.  **Install Dependencies**:
    Make sure you have Python 3 installed. It is recommended to use a virtual environment.

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```

2.  **Set up Environment Variables**:
    Create a `.env` file in the root of the project and add your OpenAI API key:

    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

3.  **Run the Application**:
    With the virtual environment activated, run the Flask application:

    ```bash
    flask run
    ```

    The application will be available at `http://127.0.0.1:5000`.
