from flask import Flask, jsonify, render_template, request
from openai import OpenAI, RateLimitError, APIStatusError
import os
import requests
import json
import subprocess
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Ollama configuration
OLLAMA_ENDPOINT = os.getenv("OLLAMA_ENDPOINT", "http://127.0.0.1:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma") 

# Topics file path
TOPICS_FILE = 'topics.json'

def load_topics():
    """Load topics from JSON file."""
    try:
        with open(TOPICS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Default topics if file doesn't exist
        default_topics = [
            "functions",
            "map/filter/reduce",
            "recursion",
            "immutable data structures",
            "error handling"
        ]
        save_topics(default_topics)
        return default_topics

def save_topics(topics):
    """Save topics to JSON file."""
    with open(TOPICS_FILE, 'w') as f:
        json.dump(topics, f, indent=2)

def call_ollama(prompt):
    """Helper function to call the Ollama API."""
    try:
        response = requests.post(
            OLLAMA_ENDPOINT,
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        # The actual response from Ollama is in the 'response' key
        return response.json().get("response", "")
    except requests.exceptions.RequestException as e:
        print(f"Error calling Ollama: {e}")
        # Return a specific error message that can be displayed to the user
        return "ollama_error: Could not connect to the local Ollama server. Is it running?"


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/topics', methods=['GET'])
def get_topics():
    return jsonify(load_topics())

@app.route('/api/topics', methods=['POST'])
def add_topic():
    data = request.get_json()
    new_topic = data.get('topic', '').strip()
    if not new_topic:
        return jsonify({"error": "Topic name is required"}), 400
    
    topics = load_topics()
    if new_topic in topics:
        return jsonify({"error": "Topic already exists"}), 400
    
    topics.append(new_topic)
    save_topics(topics)
    return jsonify({"success": True, "topics": topics})

@app.route('/api/topics/<topic>', methods=['DELETE'])
def delete_topic(topic):
    topics = load_topics()
    if topic not in topics:
        return jsonify({"error": "Topic not found"}), 404
    
    topics.remove(topic)
    save_topics(topics)
    return jsonify({"success": True, "topics": topics})

@app.route('/api/topic-explanation', methods=['POST'])
def get_topic_explanation():
    data = request.get_json()
    topic = data.get('topic')
    if not topic:
        return jsonify({"error": "Topic is required"}), 400
    
    prompt = f"Explain what '{topic}' is in Python programming. Describe its purpose, what it does, and why it's important. Keep it concise (2-3 sentences) and beginner-friendly."
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful Python tutor that explains programming concepts clearly and concisely."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
        )
        explanation = response.choices[0].message.content.strip()
        return jsonify({"explanation": explanation})
    except Exception as e:
        print(f"Error getting topic explanation: {e}")
        return jsonify({"error": "Failed to get explanation"}), 500

@app.route('/api/question', methods=['POST'])
def get_question():
    data = request.get_json()
    topic = data.get('topic')
    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    # Vary the question types for more diversity
    question_types = [
        # Basic coding questions
        f"Generate a short coding question about Python '{topic}'. Ask the student to write a small code snippet or complete a function with specific requirements. ONLY provide the question, do NOT include the answer or solution.",
        
        # Multiple choice
        f"Create a multiple-choice question about Python '{topic}' that tests understanding of syntax or definitions. Provide ONLY the question with answer choices (A, B, C, D), do NOT reveal which answer is correct. At the end, add 'Answer with the letter of your choice (e.g., A, B, C, or D).'",
        
        # Fill in the blank
        f"Write a fill-in-the-blank question about Python '{topic}' focusing on a specific syntax or concept. ONLY provide the question with blanks, do NOT provide the answer.",
        
        # Output prediction
        f"Generate a 'what will be the output' question about Python '{topic}' with a small code example. Ask what the output will be, but do NOT provide the actual answer.",
        
        # True/false
        f"Create a true/false question about Python '{topic}'. State the claim and ask if it's true or false, but do NOT provide the answer or explanation.",
        
        # Conceptual
        f"Ask a conceptual question about Python '{topic}' that requires a short answer explaining how something works. ONLY ask the question, do NOT provide the answer.",
        
        # Code comprehension - NEW (like test Q1)
        f"Provide a Python code snippet about '{topic}' (5-10 lines) and ask the student to analyze what it does or what value it returns for specific inputs. Do NOT provide the answer. Format: Show the code, then ask 'What does this function return when called with [specific inputs]?'",
        
        # Code comprehension with reasoning - NEW (like test Q1c)
        f"Show a Python function related to '{topic}' and ask a multiple-choice question about its behavior or a statement that must be true about its inputs/outputs. Provide choices A, B, C, D. Do NOT reveal the answer.",
        
        # Function writing with constraints - NEW (like test Q2, Q4)
        f"Create a function-writing question about '{topic}'. Specify: function name, parameters, return type, and specific behavior requirements. Include 1-2 example calls with expected outputs. Ask student to implement the function. Do NOT provide the solution.",
        
        # Recursion tracing - NEW (like test Q3) - only use for recursion topic
        f"For the topic '{topic}', if it involves recursion, provide a recursive function and ask about its execution: 'How many times is the function called?' or 'What is the order of operations?' or 'What is the base case reached first?'. Make it multiple choice with options A, B, C, D. Do NOT reveal the answer." if 'recurs' in topic.lower() else f"Create a step-by-step execution question about '{topic}'. Show code and ask what happens at each step or what the final result is. Multiple choice format with A, B, C, D.",
        
        # Input/output specification - NEW (like test Q1b)
        f"Show a Python function related to '{topic}' and ask: 'Provide specific input values that would make this function return [True/False/a specific value]'. Do NOT give the answer, just pose the question with the function code."
    ]
    
    import random
    prompt = random.choice(question_types)
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates Python quiz questions similar to college CS exams. Generate ONLY the question itself without providing any answers, solutions, or explanations. The student should solve it themselves. For code comprehension questions, provide clear, runnable code. For function-writing questions, specify exact requirements and examples."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=1.2,  # Increase randomness
        )
        question = response.choices[0].message.content.strip()
        return jsonify({"question": question})
    except (RateLimitError, APIStatusError) as e:
        # If OpenAI fails due to rate limit or quota, fall back to Ollama
        print(f"OpenAI API error: {e}. Falling back to Ollama.")
        ollama_response = call_ollama(prompt)
        if "ollama_error:" in ollama_response:
            return jsonify({"error": ollama_response.replace("ollama_error: ", "")}), 500
        return jsonify({"question": ollama_response.strip()})
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred. Please check the server logs."}), 500


@app.route('/api/submit', methods=['POST'])
def submit_answer():
    data = request.get_json()
    topic = data.get('topic')
    question = data.get('question')
    answer = data.get('answer')

    if not all([topic, question, answer]):
        return jsonify({"error": "Topic, question, and answer are required"}), 400

    prompt = f"""Python topic: {topic}
Question: {question}
Student's answer: {answer}

Please evaluate the student's answer and respond in this format:
1. First line: 'true' or 'false' (whether the answer is correct)
2. If false, provide the correct answer with proper code formatting
3. Then provide a brief explanation

Example format:
false
Correct answer:
```python
def example():
    return True
```
Explanation: The student's answer is incorrect because..."""

    try:
        # First, try OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful Python tutor that validates student answers. You MUST respond in this exact format:\n\nLine 1: Either 'CORRECT' or 'INCORRECT' (nothing else on this line)\nLine 2 onwards: Explanation\n\nFor multiple-choice questions, accept answers in any format: just the letter (a/A), letter with parenthesis (A)), or the full option text. For code questions, be lenient with style differences (spacing, variable names) but strict about logic. For code comprehension questions, accept equivalent answers."},
                {"role": "user", "content": f"Question: {question}\n\nStudent's answer: {answer}\n\nValidate if the student's answer is correct. For multiple-choice questions, the student might answer with just a letter (like 'b' or 'B'), so check if their answer matches the correct option by letter. For coding questions, verify the logic is correct even if formatting differs slightly. For analysis questions, check if the reasoning is sound. Remember: First line must be ONLY 'CORRECT' or 'INCORRECT', then provide detailed explanation with the correct answer if they're wrong."}
            ],
            max_tokens=600,
        )
        result_text = response.choices[0].message.content.strip()
    except (RateLimitError, APIStatusError) as e:
        # If OpenAI fails, fall back to Ollama
        print(f"OpenAI API error: {e}. Falling back to Ollama.")
        result_text = call_ollama(prompt)
        if "ollama_error:" in result_text:
            return jsonify({"error": result_text.replace("ollama_error: ", "")}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred. Please check the server logs."}), 500

    lines = result_text.split('\n', 1)
    first_line = lines[0].strip().upper()
    is_correct = 'CORRECT' in first_line and 'INCORRECT' not in first_line
    explanation = lines[1].strip() if len(lines) > 1 else "No explanation provided."
    
    return jsonify({"correct": is_correct, "explanation": explanation})


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    topic = data.get('topic')
    question = data.get('question')
    answer = data.get('answer')
    follow_up_question = data.get('follow_up_question')

    if not follow_up_question:
        return jsonify({"error": "Follow-up question is required"}), 400

    prompt = f"A student is learning about the Python topic '{topic}'.\nThey were asked the question: '{question}'.\nThey answered: '{answer}'.\nNow, they have a follow-up question: '{follow_up_question}'.\n\nPlease provide a helpful and concise answer to the student's follow-up question."

    try:
        # First, try OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers follow-up questions about Python programming."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
        )
        chat_response = response.choices[0].message.content.strip()
        return jsonify({"response": chat_response})
    except (RateLimitError, APIStatusError) as e:
        # If OpenAI fails, fall back to Ollama
        print(f"OpenAI API error: {e}. Falling back to Ollama.")
        ollama_response = call_ollama(prompt)
        if "ollama_error:" in ollama_response:
            return jsonify({"error": ollama_response.replace("ollama_error: ", "")}), 500
        return jsonify({"response": ollama_response})
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred. Please check the server logs."}), 500


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'production') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)
