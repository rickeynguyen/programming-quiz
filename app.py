from flask import Flask, jsonify, render_template, request
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

TOPICS = [
    "functions",
    "map, filter and reduce",
    "recursion",
    "immutable data structures",
    "error handling",
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/topics', methods=['GET'])
def get_topics():
    return jsonify(TOPICS)

@app.route('/api/question', methods=['POST'])
def get_question():
    data = request.get_json()
    topic = data.get('topic')
    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Generate a short, fill-in-the-blank or short-answer question about Python '{topic}' suitable for a student memorizing syntax or definitions.",
            max_tokens=50,
            n=1,
            stop=None,
            temperature=0.7,
        )
        question = response.choices[0].text.strip()
        return jsonify({"question": question})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/submit', methods=['POST'])
def submit_answer():
    data = request.get_json()
    topic = data.get('topic')
    question = data.get('question')
    answer = data.get('answer')

    if not all([topic, question, answer]):
        return jsonify({"error": "Topic, question, and answer are required"}), 400

    try:
        prompt = f"Python topic: {topic}\nQuestion: {question}\nStudent's answer: {answer}\n\nIs the student's answer correct? Please respond with only 'true' or 'false'. Then, on a new line, provide a brief explanation for why the answer is correct or incorrect."
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=100,
            n=1,
            stop=None,
            temperature=0.5,
        )
        result_text = response.choices[0].text.strip()
        lines = result_text.split('\n', 1)
        is_correct = lines[0].strip().lower() == 'true'
        explanation = lines[1].strip() if len(lines) > 1 else "No explanation provided."
        
        return jsonify({"correct": is_correct, "explanation": explanation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    topic = data.get('topic')
    question = data.get('question')
    answer = data.get('answer')
    follow_up_question = data.get('follow_up_question')

    if not follow_up_question:
        return jsonify({"error": "Follow-up question is required"}), 400

    try:
        prompt = f"A student is learning about the Python topic '{topic}'.\nThey were asked the question: '{question}'.\nThey answered: '{answer}'.\nNow, they have a follow-up question: '{follow_up_question}'.\n\nPlease provide a helpful and concise answer to the student's follow-up question."
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )
        chat_response = response.choices[0].text.strip()
        return jsonify({"response": chat_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
