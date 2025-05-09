// Dynamically load Eruda for debugging
(function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/eruda';
  script.onload = () => {
    eruda.init();
    console.log("Eruda initialized. Open it by clicking the floating icon.");
  };
  document.body.appendChild(script);
})();

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

  const DB_NAME = "ChatbotDB";
  const DB_VERSION = 1;
  const STORE_NAME = "learnedData";

  let db;

  // Open IndexedDB
  const openDB = () => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      // Create an object store for learned data
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database opened successfully.");
    };

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.errorCode);
    };
  };

  openDB();

  const saveLearnedResponse = (pattern, responses) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const data = { pattern: pattern.toString(), responses };

    store.add(data);

    transaction.oncomplete = () => {
      console.log("Learned response saved successfully.");
    };

    transaction.onerror = (event) => {
      console.error("Error saving learned response:", event.target.errorCode);
    };
  };

  const getLearnedResponses = () => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);

      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
    });
  };

  async function getBotResponse(text) {
    console.log("User input:", text);

    const learnedData = await getLearnedResponses();

    for (const item of learnedData) {
      const pattern = new RegExp(item.pattern, "i");
      if (pattern.test(text)) {
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
    saveLearnedResponse(pattern, [botResponse]);
    console.log("Learned new response.");
  }

  function generateTextFromLearnedData() {
    // Placeholder for Markov chain logic (same as current implementation)
    return "Generated response.";
  }

  inputForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, "user-message");
    userInput.value = "";
    userInput.focus();

    setTimeout(async () => {
      const response = await getBotResponse(text);
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
