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
    const eli5Button = document.getElementById('eli5-button');
    const eli5Explanation = document.getElementById('eli5-explanation');
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

    // Simple markdown to HTML converter for better formatting
    function formatText(text) {
        if (!text) return '';
        
        // Convert code blocks (```language\ncode\n```)
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        
        // Convert inline code (`code`)
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Convert bold (**text** or __text__)
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Convert italic (*text* or _text_)
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');
        
        // Convert line breaks
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    // Fetch topics on page load
    function loadTopics() {
        fetch('/api/topics')
            .then(response => response.json())
            .then(topics => {
                topicsList.innerHTML = '';
                topics.forEach(topic => {
                    const topicContainer = document.createElement('div');
                    topicContainer.className = 'topic-item';
                    
                    const topicButton = document.createElement('button');
                    topicButton.textContent = topic;
                    topicButton.className = 'topic-btn';
                    topicButton.addEventListener('click', () => startQuiz(topic));
                    
                    const infoButton = document.createElement('button');
                    infoButton.textContent = '?';
                    infoButton.className = 'info-btn';
                    infoButton.title = 'What is this topic?';
                    infoButton.addEventListener('click', () => showTopicExplanation(topic));
                    
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '×';
                    deleteButton.className = 'delete-btn';
                    deleteButton.title = 'Delete topic';
                    deleteButton.addEventListener('click', () => deleteTopic(topic));
                    
                    topicContainer.appendChild(topicButton);
                    topicContainer.appendChild(infoButton);
                    topicContainer.appendChild(deleteButton);
                    topicsList.appendChild(topicContainer);
                });
            });
    }
    
    loadTopics();
    
    // Add new topic
    const addTopicBtn = document.getElementById('add-topic-btn');
    const newTopicInput = document.getElementById('new-topic-input');
    
    function addNewTopic() {
        const newTopic = newTopicInput.value.trim();
        if (!newTopic) {
            alert('Please enter a topic name');
            return;
        }
        
        fetch('/api/topics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: newTopic })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                newTopicInput.value = '';
                loadTopics();
            }
        })
        .catch(error => {
            console.error('Error adding topic:', error);
            alert('Error adding topic');
        });
    }
    
    addTopicBtn.addEventListener('click', addNewTopic);
    
    newTopicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTopic();
        }
    });
    
    // Delete topic
    function deleteTopic(topic) {
        if (!confirm(`Are you sure you want to delete the topic "${topic}"?`)) {
            return;
        }
        
        fetch(`/api/topics/${encodeURIComponent(topic)}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                loadTopics();
            }
        })
        .catch(error => {
            console.error('Error deleting topic:', error);
            alert('Error deleting topic');
        });
    }
    
    // Show topic explanation
    function showTopicExplanation(topic) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'topic-explanation-modal';
        explanationDiv.innerHTML = `
            <div class="modal-content">
                <h3>${topic}</h3>
                <div class="spinner"></div>
                <p>Loading explanation...</p>
                <button class="close-modal">Close</button>
            </div>
        `;
        document.body.appendChild(explanationDiv);
        
        fetch('/api/topic-explanation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic })
        })
        .then(response => response.json())
        .then(data => {
            if (data.explanation) {
                explanationDiv.querySelector('.modal-content').innerHTML = `
                    <h3>${topic}</h3>
                    <p>${data.explanation}</p>
                    <button class="close-modal">Close</button>
                `;
            } else {
                explanationDiv.querySelector('.modal-content').innerHTML = `
                    <h3>${topic}</h3>
                    <p>Error loading explanation</p>
                    <button class="close-modal">Close</button>
                `;
            }
            
            explanationDiv.querySelector('.close-modal').addEventListener('click', () => {
                document.body.removeChild(explanationDiv);
            });
        })
        .catch(error => {
            console.error('Error getting explanation:', error);
            explanationDiv.querySelector('.modal-content').innerHTML = `
                <h3>${topic}</h3>
                <p>Error loading explanation</p>
                <button class="close-modal">Close</button>
            `;
            explanationDiv.querySelector('.close-modal').addEventListener('click', () => {
                document.body.removeChild(explanationDiv);
            });
        });
        
        explanationDiv.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(explanationDiv);
        });
    }

    // Auto-expand textarea as user types
    answerInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
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
        console.log('fetchQuestion called - resetting UI');
        // Reset UI state for new question
        resultContainer.classList.add('hidden');
        nextQuestionBtn.classList.add('hidden');
        eli5Button.classList.add('hidden');
        eli5Explanation.classList.add('hidden');
        answerInput.value = '';
        answerInput.style.height = 'auto';
        submitAnswerBtn.classList.remove('hidden');
        submitAnswerBtn.disabled = false;
        answerInput.disabled = false;
        
        console.log('Submit button visible:', !submitAnswerBtn.classList.contains('hidden'));
        console.log('Submit button disabled:', submitAnswerBtn.disabled);
        console.log('Answer input disabled:', answerInput.disabled);
        
        // Show loading spinner
        questionText.innerHTML = '<div class="spinner"></div><div class="loading-text">Generating question...</div>';
        
        fetch('/api/question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: currentTopic }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Question data received:', data);
            if (data.error) {
                questionText.innerHTML = `<strong>Error:</strong> ${data.error}`;
            } else if (data.question) {
                currentQuestion = data.question;
                questionText.innerHTML = formatText(currentQuestion);
                console.log('Question displayed, UI should be ready for input');
            } else {
                questionText.textContent = 'Error: No question received';
            }
        })
        .catch(error => {
            console.error('Error fetching question:', error);
            questionText.textContent = 'Error loading question. Please try again.';
        });
    }

    submitAnswerBtn.addEventListener('click', () => {
        console.log('Submit button clicked');
        const answer = answerInput.value;
        
        // Disable submit button and answer input, show loading state
        submitAnswerBtn.disabled = true;
        submitAnswerBtn.textContent = 'Checking...';
        answerInput.disabled = true;
        resultContainer.classList.remove('hidden');
        resultText.innerHTML = '<div class="spinner"></div>';
        explanationText.innerHTML = '<div class="loading-text">Validating your answer...</div>';
        
        console.log('Submitting answer, button and input now disabled');
        
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
            // Keep submit button and input disabled after answer is checked
            submitAnswerBtn.textContent = 'Submit';
            
            resultContainer.classList.remove('hidden');
            nextQuestionBtn.classList.remove('hidden');
            eli5Button.classList.remove('hidden');
            eli5Explanation.classList.add('hidden');
            explanationText.innerHTML = formatText(data.explanation);
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
        })
        .catch(error => {
            // Re-enable submit button and input on error
            submitAnswerBtn.disabled = false;
            submitAnswerBtn.textContent = 'Submit';
            answerInput.disabled = false;
            
            console.error('Error submitting answer:', error);
            resultText.textContent = 'Error checking answer. Please try again.';
            explanationText.textContent = '';
        });
    });

    nextQuestionBtn.addEventListener('click', () => {
        console.log('Next Question button clicked');
        fetchQuestion();
    });

    // ELI5 (Explain Like I'm 5) functionality
    eli5Button.addEventListener('click', () => {
        eli5Button.disabled = true;
        eli5Button.textContent = 'Generating simple explanation...';
        eli5Explanation.classList.remove('hidden');
        eli5Explanation.innerHTML = '<div class="spinner"></div><div class="loading-text">Creating simple explanation...</div>';
        
        const eli5Prompt = `Question: ${currentQuestion}\nStudent's answer: ${answerInput.value}\n\nPlease explain this question and the correct answer in very simple terms that a 5th grader or elementary student can understand. Use simple words, analogies, and examples.`;
        
        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: currentTopic,
                question: currentQuestion,
                answer: answerInput.value,
                follow_up_question: eli5Prompt,
            }),
        })
        .then(response => response.json())
        .then(data => {
            eli5Button.disabled = false;
            eli5Button.textContent = 'Explain Like I\'m 5';
            if (data.response) {
                eli5Explanation.innerHTML = '<strong>Simple Explanation:</strong><br>' + formatText(data.response);
            } else {
                eli5Explanation.textContent = 'Error getting simple explanation.';
            }
        })
        .catch(error => {
            eli5Button.disabled = false;
            eli5Button.textContent = 'Explain Like I\'m 5';
            eli5Explanation.textContent = 'Error getting simple explanation.';
        });
    });

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

        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        userMessage.innerHTML = `<strong>You:</strong> ${followUpQuestion}`;
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
            const aiMessage = document.createElement('div');
            aiMessage.className = 'chat-message ai-message';
            aiMessage.innerHTML = `<strong>AI:</strong> ${formatText(data.response)}`;
            chatHistory.appendChild(aiMessage);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        });
    });
});
