document.addEventListener('DOMContentLoaded', () => {
    const topicSelection = document.getElementById('topic-selection');
    const topicsList = document.getElementById('topics-list');
    const quizArea = document.getElementById('quiz-area');
    const currentTopicTitle = document.getElementById('current-topic');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const explanationText = document.getElementById('explanation-text');
    const nextQuestionBtn = document.getElementById('next-question');
    const correctCountSpan = document.getElementById('correct-count');
    const incorrectCountSpan = document.getElementById('incorrect-count');
    const chatButton = document.getElementById('chat-button');
    const changeTopicBtn = document.getElementById('change-topic');
    const chatArea = document.getElementById('chat-area');
    const chatHistory = document.getElementById('chat-history');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    const closeChatBtn = document.getElementById('close-chat');

    let currentTopic = '';
    let currentQuestion = '';
    let correctCount = 0;
    let incorrectCount = 0;

    // Fetch topics on page load
    fetch('/api/topics')
        .then(response => response.json())
        .then(topics => {
            topics.forEach(topic => {
                const button = document.createElement('button');
                button.textContent = topic;
                button.addEventListener('click', () => startQuiz(topic));
                topicsList.appendChild(button);
            });
        });

    function startQuiz(topic) {
        currentTopic = topic;
        currentTopicTitle.textContent = `Topic: ${topic}`;
        topicSelection.classList.add('hidden');
        quizArea.classList.remove('hidden');
        correctCount = 0;
        incorrectCount = 0;
        updateScore();
        fetchQuestion();
    }

    function fetchQuestion() {
        resultContainer.classList.add('hidden');
        nextQuestionBtn.classList.add('hidden');
        answerInput.value = '';
        fetch('/api/question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: currentTopic }),
        })
        .then(response => response.json())
        .then(data => {
            currentQuestion = data.question;
            questionText.textContent = currentQuestion;
        });
    }

    submitAnswerBtn.addEventListener('click', () => {
        const answer = answerInput.value;
        fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: currentTopic,
                question: currentQuestion,
                answer: answer,
            }),
        })
        .then(response => response.json())
        .then(data => {
            resultContainer.classList.remove('hidden');
            nextQuestionBtn.classList.remove('hidden');
            explanationText.textContent = data.explanation;
            if (data.correct) {
                resultText.textContent = 'Correct!';
                resultText.className = 'correct';
                correctCount++;
            } else {
                resultText.textContent = 'Incorrect!';
                resultText.className = 'incorrect';
                incorrectCount++;
            }
            updateScore();
        });
    });

    nextQuestionBtn.addEventListener('click', fetchQuestion);

    changeTopicBtn.addEventListener('click', () => {
        quizArea.classList.add('hidden');
        topicSelection.classList.remove('hidden');
    });

    function updateScore() {
        correctCountSpan.textContent = correctCount;
        incorrectCountSpan.textContent = incorrectCount;
    }

    // Chat functionality
    chatButton.addEventListener('click', () => {
        chatArea.classList.remove('hidden');
    });

    closeChatBtn.addEventListener('click', () => {
        chatArea.classList.add('hidden');
    });

    sendChatBtn.addEventListener('click', () => {
        const followUpQuestion = chatInput.value;
        if (!followUpQuestion) return;

        const userMessage = document.createElement('p');
        userMessage.textContent = `You: ${followUpQuestion}`;
        chatHistory.appendChild(userMessage);
        chatInput.value = '';

        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: currentTopic,
                question: currentQuestion,
                answer: answerInput.value,
                follow_up_question: followUpQuestion,
            }),
        })
        .then(response => response.json())
        .then(data => {
            const aiMessage = document.createElement('p');
            aiMessage.textContent = `AI: ${data.response}`;
            chatHistory.appendChild(aiMessage);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        });
    });
});
