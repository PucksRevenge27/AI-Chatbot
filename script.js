document.addEventListener("DOMContentLoaded", () => {
  console.log("Chatbot initialized.");
  const chatContainer = document.getElementById("chat-container");
  const inputForm = document.getElementById("input-form");
  const userInput = document.getElementById("user-input");

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

  const localLearnedDataKey = "chatbotLearnedData";

  const learnedData = JSON.parse(localStorage.getItem(localLearnedDataKey)) || [];

  function getBotResponse(text) {
    console.log("User input:", text);

    for (const item of learnedData) {
      if (item.pattern.test(text)) {
        const responses = item.responses;
        console.log("Learned response found:", responses);
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    for (const item of knowledgeBase) {
      for (const pattern of item.patterns) {
        if (pattern.test(text)) {
          const responses = item.responses;
          console.log("Predefined response found:", responses);
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    console.log("No match found, generating default response.");
    return generateTextFromLearnedData() || "I'm not sure how to respond to that. Would you like to teach me how to respond?";
  }

  function appendMessage(content, className) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${className}`;
    messageEl.textContent = content;
    chatContainer.appendChild(messageEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function learnResponse(userMessage, botResponse) {
    const pattern = new RegExp(userMessage, "i");
    const existing = learnedData.find(item => item.pattern.toString() === pattern.toString());
    if (existing) {
      if (!existing.responses.includes(botResponse)) {
        existing.responses.push(botResponse);
      }
    } else {
      learnedData.push({ pattern, responses: [botResponse] });
    }
    localStorage.setItem(localLearnedDataKey, JSON.stringify(learnedData));
    console.log("Learned new response:", learnedData);
  }

  function generateTextFromLearnedData() {
    if (learnedData.length === 0) return null;

    const responses = learnedData.map(item => item.responses).flat();
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

    const startWord = words[Math.floor(Math.random() * words.length)];
    let currentWord = startWord;
    const sentence = [currentWord];

    for (let i = 0; i < 15; i++) {
      const nextWords = markovChain[currentWord];
      if (!nextWords || nextWords.length === 0) break;
      currentWord = nextWords[Math.floor(Math.random() * nextWords.length)];
      sentence.push(currentWord);
    }

    return sentence.join(" ") + ".";
  }

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

  appendMessage("Hello! I'm your AI chatbot. I can learn new responses if you teach me!", "bot-message");
});
