# VS Code Copilot Agent Instructions: Python Programming Test Portal

This document outlines the steps for a VS Code Copilot agent to build a Python Programming Test Portal.

## Project Goal

To create a web-based learning portal for college computer science students to practice Python programming concepts. The focus is on memorizing definitions and syntax through interactive, AI-generated quizzes.

## High-Level Plan

1.  **Project Setup**: Transition the current React project to a Python-based Flask application.
2.  **Backend Development**: Implement the core logic using Flask, including API endpoints for topics, question generation, answer validation, and chat.
3.  **Frontend Development**: Build the user interface with HTML, CSS, and JavaScript for topic selection, quizzing, and interaction.
4.  **AI Integration**: Integrate with an AI service (e.g., OpenAI) to generate questions, validate answers, provide explanations, and power the chat feature.
5.  **Scoring and State Management**: Implement session-based scoring and state management.

---

## Phase 1: Project Setup

1.  **Clean Workspace**:
    *   Delete the existing React boilerplate files and folders: `src/`, `public/`, `jsconfig.json`, `vite.config.js`, `index.html`.
    *   Keep `README.md` (to be updated later) and `LICENSE`.
    *   Clear the contents of `package.json` and prepare it for a simple project description if needed, or delete it.

2.  **Set up Python Environment**:
    *   Create a Python virtual environment: `python -m venv .venv`.
    *   Create a `requirements.txt` file with the following dependencies:
        ```
        Flask
        openai
        python-dotenv
        ```
    *   Create a `.gitignore` file and add `.venv/`, `__pycache__/`, and `.env` to it.
    *   Create a `.env` file to store the `OPENAI_API_KEY`. **Do not commit this file.**
        ```
        OPENAI_API_KEY=your_api_key_here
        ```

3.  **Create Flask Application Structure**:
    *   Create the main application file: `app.py`.
    *   Create folders for the frontend: `templates/` and `static/`.
    *   Inside `static/`, create `css/` and `js/` folders.
    *   Inside `templates/`, create `index.html`.

---

## Phase 2: Backend Development (Flask)

1.  **Create `app.py`**:
    *   Set up a basic Flask application.
    *   Load environment variables using `dotenv`.
    *   Configure the OpenAI API key.
    *   Define a list of topics: `["functions", "map, filter and reduce", "recursion", "immutable data structures", "error handling"]`.

2.  **Implement API Endpoints**:

    *   **`@app.route('/')`**:
        *   Render the main `index.html` template.

    *   **`@app.route('/api/topics', methods=['GET'])`**:
        *   Return the list of topics as a JSON response.

    *   **`@app.route('/api/question', methods=['POST'])`**:
        *   Accepts a `topic` in the JSON body.
        *   Construct a prompt for the OpenAI API to generate a random, definition/syntax-based question for the given Python topic. The question should be suitable for a fill-in-the-blank or short-answer format.
        *   Call the OpenAI API.
        *   Return the generated question as a JSON response: `{"question": "..."}`.

    *   **`@app.route('/api/submit', methods=['POST'])`**:
        *   Accepts `topic`, `question`, and `answer` in the JSON body.
        *   Construct a prompt for the OpenAI API to:
            1.  Validate if the student's `answer` is a correct response to the `question`.
            2.  Provide a brief explanation for why the answer is correct or incorrect.
        *   Call the OpenAI API.
        *   Return a JSON response: `{"correct": true/false, "explanation": "..."}`.

    *   **`@app.route('/api/chat', methods=['POST'])`**:
        *   Accepts `topic`, `question`, `answer`, and `follow_up_question` in the JSON body.
        *   Construct a prompt for the OpenAI API that provides the context (topic, quiz question, student's answer) and asks it to answer the `follow_up_question`.
        *   Call the OpenAI API.
        *   Return the AI's response: `{"response": "..."}`.

---

## Phase 3: Frontend Development (HTML, CSS, JS)

1.  **Create `templates/index.html`**:
    *   Structure the page with sections for:
        *   Topic selection (a dropdown or list of buttons).
        *   The quiz area (initially hidden).
        *   The chat area (initially hidden).
    *   The quiz area should contain:
        *   A place to display the current topic.
        *   A `div` to display the question text.
        *   An `input` field for the answer.
        *   A "Submit" button.
        *   A "Next Question" button (initially hidden).
        *   A `div` to display the validation result (correct/incorrect) and explanation.
        *   A `div` to display the score (`Correct: X, Incorrect: Y`).
        *   Buttons to "Chat about this question" and "Change Topic".

2.  **Create `static/css/style.css`**:
    *   Add basic styling to make the portal clean, modern, and user-friendly.
    *   Style the topic selection, quiz area, chat box, buttons, and feedback messages.

3.  **Create `static/js/main.js`**:
    *   **On page load**:
        *   Fetch the list of topics from `/api/topics` and populate the topic selection area.
    *   **Event Listener for Topic Selection**:
        *   When a topic is selected, hide the topic selection view and show the quiz view.
        *   Call a function to fetch the first question for the selected topic.
    *   **`fetchQuestion(topic)` function**:
        *   Make a POST request to `/api/question` with the current topic.
        *   Display the returned question.
        *   Reset the answer input and feedback areas.
    *   **Event Listener for "Submit" button**:
        *   Get the `topic`, `question`, and `answer`.
        *   Make a POST request to `/api/submit`.
        *   Display the `correct`/`incorrect` result and the `explanation`.
        *   Update the score (right/wrong answers).
        *   Show the "Next Question" and "Chat" buttons.
    *   **Event Listener for "Next Question" button**:
        *   Call `fetchQuestion(topic)` to get a new question.
    *   **Event Listener for "Change Topic" button**:
        *   Show the topic selection view and hide the quiz view.
        *   Reset the score.
    *   **Chat Functionality**:
        *   Implement logic to show a chat modal or section.
        *   On sending a chat message, POST to `/api/chat` with the context and display the response.

---

## Phase 4: Finalization

1.  **Update `README.md`**:
    *   Add a project description, setup instructions (`pip install -r requirements.txt`), and how to run the application (`flask run`).
2.  **Testing**:
    *   Manually test all features of the application to ensure they work as expected.
    *   Check for proper error handling (e.g., when the AI service is unavailable).
