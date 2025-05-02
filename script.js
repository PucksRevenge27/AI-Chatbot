document.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.getElementById('chat-container');
  const inputForm = document.getElementById('input-form');
  const userInput = document.getElementById('user-input');

  const knowledgeBase = [
    {
      patterns: [/hi/i, /hey/i, /hello/i, /sup/i, /ey man/i, /hi ruz/i, /hello ruz/i, /sup aruuz/i],
      responses: [
        "Hi there! How can i assist you today?",
        "Sup!, What can i do for you today?",
        "Yo! I can assist you something today, what could i do it for you?"
      ]
    },
    {
      patterns: [/how are you/i, /how r u/i, /how are you today/i, /how r u feeling/i, /how are you feeling/i, /How are you/i],
      responses: [
        "I'm just an AI, so I don't have feelings, but thanks for asking this!",
        "Doing great like your paying taxes! Ready to assist you.",
        "I'm exactly feeling great today after avoid commit crimes!"
      ]
    },
    {
      patterns: [/help/i, /help me/i, /help me please/i, /help me pls/i, /can you help me/i, /help please/i, /can you help/i, /help pls/i, /hi ai can you help me/i],
      responses: [
        "Certainly! Ask me anything or just chat something.",
        "I'm here to help. What do you need?",
        "Tell me what you're looking for and I'll do my best for real no cap!"
      ]
    },
    {
      patterns: [/your name/i, /who are you/i, /tell me who are you/i, /can you tell your name/i, /whats your name/i],
      responses: [
        "I'm a simple AI chatbot named Aruuz built in your browser for sure.",
        "You can call me Ruz, or Aru, Whatever..",
        "I'm your friendly browser-based AI ahh type.",
        "I'm just an single little Aruuz AI that works properly (i think)",
        "Well, just an Named AI that inspired by some AI Studios for real bud.."
      ]
    },
    {
      patterns: [/weather/i, /weather today/i, /hows the weather today/i, /it is rain today/i, /it is sunny today/i, /it is snowing today/i, /Weather/i],
      responses: [
        "What the hell your talking about, i'm not your Weather Reporter!",
        "I wish I could tell you, but I'm not yet to generated your local Weather Location.",
        "Just check the Weather app or browser dude, i'm not your personal teller!",
        "Try to see it for yourself in outside!"
      ]
    },
    {
      patterns: [/bye/i, /goodbye/i, /see you again/i, /bye ai!/i, /see you/i, /See you/i],
      responses: [
        "Goodbye! Have a great day!",
        "See you later! Come back anytime.",
        "Bye! It was nice chatting with you.",
        "Have a great day out there!"
      ]
    },
    {
      patterns: [/what's happening in 2001/i, /what happen in 2001/i, /what's happening in 9 september/i, /2001/i, /year 2001/i],
      responses: [
        "The year's most prominent event was the September 11 attacks against the United States by al-Qaeda, which killed 2,977 people and instigated the global war on terror. The United States led a multi-national coalition in an invasion of Afghanistan after the Taliban government was unable to extradite Al-Qaeda leader Osama bin Laden within 24 hours. Other international conflicts in 2001 were the standoff between India and Pakistan as well as the Second Intifada between Israel and Palestine. Internal conflicts began in Macedonia, in the Central African Republic, and in Guinea. Political challenges or violent conflicts caused changes in leadership in Argentina, the Democratic Republic of the Congo, Indonesia, Nepal, and the Philippines.  (quoted from Wikipedia)",
        "In 2001, the year was dominated by the September 11 terrorist attacks on the United States, which led to the global war on terror and the invasion of Afghanistan. Nineteen Al-Qaeda terrorists hijacked four planes, crashing two into the World Trade Center in New York City, one into the Pentagon in Washington, D.C., and the fourth into a field in Pennsylvania.",
        "The religiously motivated September 11 attacks came to dominate global discourse about religion in 2001. Following the attacks, both religious tolerance and religious intolerance came to the fore, with an increase in Islamophobia, particularly in the United States and Europe.  The imposition of religious law became a major subject of debate, particularly in Afghanistan, where the perpetrators of the attacks were protected by the fundamentalist Taliban, as well as Nigeria, where conflict between Christians and Muslims escalated amid the implementation of Islamic law.  Prior to the attacks, the Taliban had incited a different religious controversy by destroying the Buddhas of Bamiyan despite the international community's pleas.  Another religious conflict took place in Khartoum, Sudan, when Christians were forcibly expelled from the Anglican cathedral during Easter services.",
        "Politics and religion in the final months of 2001 focused intently on the Muslim world and Islamic terrorism after the September 11 attacks. The Catholic Church was active in 2001, as Pope John Paul II went on several goodwill trips to meet with non-Catholic religious groups and investigations of sexual abuse cases among the church's priests began. Former Yugoslav president Slobodan Milošević was arrested and became the first head of state to be charged with crimes against humanity by an international body. The 27th G8 summit took place in Genoa and was met by 200,000 protestors, where one was killed. 2001 took place during a minor recession among developed and developing nations, with only middle income nations avoiding an economic downturn. The recession saw economic crises take place in Argentina and in Turkey. American energy company Enron and the European airlines Sabena and Swissair all ended operations in 2001."
      ]
    },
    {
      patterns: [/where do i live/i, /where i am live/i, /what is my address/i, /what's my address/i, /what's my country/i, /whats my address/i, /what is my location/i, /whats my location/i, /tell me where am i/i, /my location/i, /my address/i, /thats not my location/i, /thats not my address/i, /its not my location/i],
      responses: [
        "Maybe, lives somewhere in Europe or Asia?",
        "I'll think you lives at Europe.",
        "You are currently in America Latin!",
        "You are currently from Oceania!",
        "Maybe, lives somewhere in Africa or South America",
        "Maybe, lives somewhere in Asia or America Latin",
        "You are currently in Asia!",
        "You are currently in South America!",
        "You are currently from Europe!",
        "I'll think you lives at South America",
        "I can't tell it to you, but i'll keep it secret..!",
        "I know your address, But i can't tell it to u."
      ]
    },
    {
      patterns: [/list/i, /List/i],
      responses: [
        "List of command that can you use it to chat with me: (Hi) for saying hello, (How are you) for talking to me an feeling, (Your name) for talking to me my name, (Weather) for talking to me weather in your location, (Goodbye) for saying see you, (My location) for guessing your current location, (Who's your creator) you can talk to me who am i being created, (version) you can see the latest version of me!, That's all of them for you talking to me, Goodbye:)!"
      ]
    },
    {
      patterns: [/meaning of lua/i, /what is lua mean/i, /lua meaning/i, /what is lua/i, /lua/i, /Lua/i],
      responses: [
        "In Portuguese, 'lua' (pronounced LOO-ah) means'moon'. It's also a programming language, a lightweight, embeddable scripting language designed for applications. The name was chosen as a playful reference to a previous programming language called 'SOL' (Simple Object Language), as means 'sun' in Portuguese.",
        "Lua is a lightweight, high-level, multi-paradigm scripting language designed for embedded use in applications. It's known for its simplicity, efficiency, and ease of integration with other programming languages, especially C and C++. Lua's small size and fast execution make it suitable for applications where performance and memory usage are critical.",
        "Lua is a programming language that can be further classified as a scripting language. Scripting languages are programming languages that are relatively simple to use compared to other programming languages, requiring you to write fewer lines of code in addition to having a user-friendly syntax similar to JavaScript.."
      ]
    },
    {
      patterns: [/who's your creator/i, /whos your creator/i, /who created you/i, /creator/i, /Creator/i],
      responses: [
        "My Creator it known as, MDC, After i'm being created, i'm still doesn't know what those MDC means, i've maked for some reason..",
        "MDC is my creator, he makes me.",
        "MDC, the one he's created me and those running codes, he lives somewhere in Indonesia and has a friend named arya.."
      ]
    },
    {
      patterns: [/i hate you/i, /i am hate you/i, /im really hate you/i, /i'm really hate you/i],
      responses: [
        "If you hate me, just dont talk to me, suckers!",
        "Okay then, I don't care",
        "If you hate me, Ill Hate you too.",
        "Just Go away from me!"
      ]
    },
    {
      patterns: [/what's my ip/i, /whats my ip/i, /my ip/i, /what is my IP/i, /what is my ip/i],
      responses: [
        "What the hell your talking about, i'm not even know your IP lil bro, just quit it already",
        "Nuh uh, i did'nt even know your IP, but i know your Address is..",
        "Why you asking me for reveal your IP?, doesn't it means illegal?",
        "You didn't even know your own IP Address? that's to bad",
        "Why you asking me these question?"
      ]
    },
    {
      patterns: [/a/i, /b/i, /c/i, /d/i, /e/i, /f/i, /g/i, /h/i, /i/i, /j/i, /k/i, /l/i, /m/i, /n/i, /o/i, /p/i, /q/i, /r/i, /s/i, /t/i, /u/i, /v/i, /w/i, /v/i, /w/i, /x/i, /y/i, /z/i, /1/i, /2/i, /3/i, /4/i, /5/i, /6/i, /7/i, /8/i, /9/i, /0/i, /@/i, /#/i, /_/i, /&/i, /:/i, /!/i, /=/i, /€/i, /-/i],
      responses: [
        "Umm, What?",
        "Looks like you type something interesting",
        "I don't understand",
        "Just type an alphabet?",
        "Are you misspelled?",
        "Ooh, an alphabet or number?",
        "I'm don't interested of this..",
        "Can we talk something else?"
      ]
    }
  ];

  function getBotResponse(text) {
    for (const item of knowledgeBase) {
      for (const pattern of item.patterns) {
        if (pattern.test(text)) {
          const responses = item.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }
    return "I'm not sure how to respond to that text you send. Tell me more about it!, or the text isn't even added yet!";
    "I don't understand your text sending to me!";
  }

  function appendMessage(content, className) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${className}`;
    messageEl.textContent = content;
    chatContainer.appendChild(messageEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  inputForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user-message');

    userInput.value = '';
    userInput.focus();

    setTimeout(() => {
      const response = getBotResponse(text);
      appendMessage(response, 'bot-message');
    }, 500);
  });

  // Initial greeting message
  appendMessage("Hello! I'm your AI chatbot, I, Aruuz. I'm the first AI that be maked in HTML, Type 'List' for all Chat Commands!, little note here, i can't generated an Image you've wanted! (VER 1.40 'Released on Github')", 'bot-message');
});
