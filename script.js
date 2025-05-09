document.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.getElementById("chat-container");
  const inputForm = document.getElementById("input-form");
  const userInput = document.getElementById("user-input");

  // Load predefined knowledge base
  const knowledgeBase = [
    {
      patterns: [/hi/i, /hello/i],
      responses: ["Hello! How can I assist you today?", "Hi there! What can I do for you?"]
    },
    {
      patterns: [/help/i],
      responses: ["Sure! What do you need help with?", "I'm here to assist. Ask me anything."]
    }
  ];

  // Local storage key for storing learned data
  const localLearnedDataKey = "chatbotLearnedData";

  // Load learned data from localStorage or initialize as empty
  const learnedData = JSON.parse(localStorage.getItem(localLearnedDataKey)) || [];

  // Function to get a bot response
  function getBotResponse(text) {
    // Check learned data first
    for (const item of learnedData) {
      if (item.pattern.test(text)) {
        const responses = item.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Check predefined knowledge base
    for (const item of knowledgeBase) {
      for (const pattern of item.patterns) {
        if (pattern.test(text)) {
          const responses = item.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    // If no match, generate a response
    return generateTextFromLearnedData() || "I'm not sure how to respond to that. Would you like to teach me how to respond?";
  }

  // Function to append a message to the chat container
  function appendMessage(content, className) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${className}`;
    messageEl.textContent = content;
    chatContainer.appendChild(messageEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Function to teach the bot a new response
  function learnResponse(userMessage, botResponse) {
    const pattern = new RegExp(userMessage, "i");
    // Check if the pattern already exists in learned data
    const existing = learnedData.find(item => item.pattern.toString() === pattern.toString());
    if (existing) {
      if (!existing.responses.includes(botResponse)) {
        existing.responses.push(botResponse); // Add new response
      }
    } else {
      learnedData.push({ pattern, responses: [botResponse] });
    }
    // Save to localStorage
    localStorage.setItem(localLearnedDataKey, JSON.stringify(learnedData));
  }

  // Text generation using Markov Chain
  function generateTextFromLearnedData() {
    if (learnedData.length === 0) return null;

    // Collect all responses from learned data
    const responses = learnedData.map(item => item.responses).flat();

    // Split responses into words to build the Markov Chain
    const words = responses.join(" ").split(/\s+/);
    const markovChain = {};

    for (let i = 0; i < words.length - 1; i++) {
      const word = words[i];
      const nextWord = words[i + 1];
      if (!markovChain[word]) {
        markovChain[word] = [];
      }
      markovChain[word].push(nextWord);
    }

    // Generate a random sentence
    const startWord = words[Math.floor(Math.random() * words.length)];
    let currentWord = startWord;
    const sentence = [currentWord];

    for (let i = 0; i < 15; i++) { // Generate up to 15 words
      const nextWords = markovChain[currentWord];
      if (!nextWords || nextWords.length === 0) break;
      currentWord = nextWords[Math.floor(Math.random() * nextWords.length)];
      sentence.push(currentWord);
    }

    return sentence.join(" ") + ".";
  }

  // Handle form submission
  inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, "user-message");
    userInput.value = "";
    userInput.focus();

    setTimeout(() => {
      const response = getBotResponse(text);
      appendMessage(response, "bot-message");

      // If the bot asks to learn, allow the user to teach it
      if (response.includes("Would you like to teach me how to respond?")) {
        const teachForm = document.createElement("form");
        teachForm.className = "teach-form";

        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = "Teach me how to respond...";
        inputField.className = "teach-input";
        teachForm.appendChild(inputField);

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Teach";
        submitButton.className = "teach-button";
        teachForm.appendChild(submitButton);

        chatContainer.appendChild(teachForm);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        teachForm.addEventListener("submit", (event) => {
          event.preventDefault();
          const newResponse = inputField.value.trim();
          if (newResponse) {
            learnResponse(text, newResponse);
            appendMessage("Thanks! I've learned a new response.", "bot-message");
            teachForm.remove();
          }
        });
      }
    }, 500);
  });

  // Initial greeting
  appendMessage("Hello! I'm your AI chatbot. I can learn new responses if you teach me!", "bot-message");
});
