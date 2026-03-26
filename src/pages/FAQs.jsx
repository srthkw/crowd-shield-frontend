import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';

const FAQs = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your Crowd-Shield assistant. Select a question to get started.",
      isBot: true,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const messagesEndRef = useRef(null);

  const callSupport = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  }

  const emailSupport = (email) => {
    window.location.href = `mailto:${email}`;
  }

  // Hardcoded question options
  const questionOptions = [
    {
      id: 1,
      text: "What is Crowd-Shield?",
      answer: "Crowd-Shield is a web-based platform that provides essential services during public gatherings, including emergency location sharing, announcements, lost-and-found support, and access to emergency helplines—all in one place."
    },
    {
      id: 2,
      text: "Do I need to install an app to use Crowd-Shield?",
      answer: "No. Crowd-Shield is fully browser-based, so it can be accessed directly without downloading or installing any application."
    },
    {
      id: 3,
      text: "Does Crowd-Shield manage or control crowds?",
      answer: "No. Crowd-Shield does not manage or control crowd movement. It is designed to provide support services that improve communication and accessibility during public gatherings."
    },
    {
      id: 4,
      text: "How does the emergency feature work?",
      answer: "When a user activates the emergency button, their location is shared with event organizers, allowing them to respond more quickly to the situation."
    },
    {
      id: 5,
      text: "Who receives emergency alerts?",
      answer: "Emergency alerts are sent to authorized organizers or administrators associated with the event."
    },
    {
      id: 6,
      text: "How does the lost and found system work?",
      answer: "Users can report lost items or browse items that have been found. This increases the chances of recovering belongings during crowded events."
    },
    {
      id: 7,
      text: "Who can post announcements?",
      answer: "Announcements are role-based: Administrators can post announcements across all events, while Organizers can post announcements for events they manage."
    },
    {
      id: 8,
      text: "What kind of announcements can be shared?",
      answer: "Organizers and administrators can share important updates such as safety instructions, event information, or emergency notices."
    },
    {
      id: 9,
      text: "How do emergency helplines work?",
      answer: "The platform provides a list of important national emergency contacts. Users can directly initiate a call through their device by selecting a helpline."
    },
    {
      id: 10,
      text: "Is Crowd-Shield free to use?",
      answer: "Yes, Crowd-Shield can be accessed and used without any installation or payment requirements (unless you plan otherwise later)."
    },
    {
      id: 11,
      text: "Does the platform work without an internet connection?",
      answer: "No. Crowd-Shield requires an active internet connection to function properly."
    },
    {
      id: 12,
      text: "Is my location data stored permanently?",
      answer: "Location data is used only during emergency situations and is handled as per system design. It is not stored permanently unless required for incident reporting."
    },
    {
      id: 13,
      text: "Can anyone use Crowd-Shield?",
      answer: "Yes. Anyone attending a public gathering can use the platform. However, certain features like announcements are restricted to authorized roles."
    },
    {
      id: 14,
      text: "What are the limitations of Crowd-Shield?",
      answer: "Requires internet connectivity, depends on active user participation, and is not integrated with official government emergency systems."
    },
    {
      id: 15,
      text: "Can this system be expanded in the future?",
      answer: "Yes. Future improvements may include real-time updates, volunteer coordination, and integration with official event or emergency services."
    }
  ];

  const isFirstRender = useRef(true);

  // Scroll to bottom whenever messages change
  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // 🚫 skip first run
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Simulate typing effect
  const simulateTyping = (answer) => {
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 1,
        text: answer,
        isBot: true,
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setSelectedQuestion(null);
    }, 1000 + Math.random() * 1000); // Random typing time between 1-2 seconds
  };

  const handleQuestionSelect = (question) => {
    if (selectedQuestion) return; // Prevent multiple selections while typing

    setSelectedQuestion(question);

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: question.text,
      isBot: false,
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot typing
    simulateTyping(question.answer);
  };

  // SVG Icons
  const BotIcon = () => (
    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const TypingIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h.01M12 12h.01M20 12h.01M8 12h.01M16 12h.01" />
    </svg>
  );

  const QuestionIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const SendIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-3 md:py-8 md:px-4">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 md:mb-5">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-1">
              FAQs about Crowd-Shield
            </h1>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row mx-auto border-y-6 border-blue-200">
            {/* Messages Area */}
            <div className="h-[450px] w-full overflow-y-auto no-scrollbar-zero p-3 md:p-4 space-y-3 md:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] md:max-w-[75%] ${!message.isBot && 'flex-row-reverse space-x-reverse'}`}>
                    <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${message.isBot ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {message.isBot ? <BotIcon /> : <UserIcon />}
                    </div>
                    <div
                      className={`rounded-2xl px-3 py-2 md:px-4 md:py-2 ${message.isBot
                          ? 'bg-green-100 text-gray-800'
                          : 'bg-blue-400 text-white'
                        }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[85%] md:max-w-[75%]">
                    <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <BotIcon />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-3 py-2 md:px-4 md:py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex flex-col border-t-2 md:border-l-2 border-gray-200">
              {/* Questions Grid */}
              <div className="bg-gray-50 p-3 md:p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-600"><QuestionIcon /></span>
                  <p className="text-xs md:text-sm font-medium text-gray-700">
                    Select a question:
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[350px] md:max-h-auto overflow-y-auto no-scrollbar">
                  {questionOptions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionSelect(question)}
                      disabled={isTyping || selectedQuestion !== null}
                      className={`text-left text-xs md:text-sm px-3 py-2 rounded-lg transition-all ${isTyping || selectedQuestion !== null
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300'
                        }`}
                    >
                      {question.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Footer */}
              <div className="border-t border-gray-200 px-3 py-2 md:px-4 md:py-3 bg-white">
                <div className="flex items-center justify-center space-x-2 text-gray-500">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-center">
                    Select any question to get instant answers about Crowd-Shield
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-12 bg-cyan-500 rounded-xl p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Still have questions?
          </h2>
          <p className="text-indigo-100 mb-6">
            Can't find the answer you're looking for? Please reach out to our support team.
          </p>
          <div className="flex flex-col md:hidden sm:flex-row justify-center gap-4">
            <button onClick={() => callSupport('+919503576191')} className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-300 shadow-md cursor-pointer">
              Call Us
            </button>
            <button onClick={() => emailSupport('srthk44@gmail.com')} className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-300 shadow-md cursor-pointer">
              Mail Us
            </button>
          </div>
          <p className="text-indigo-100 hidden md:block mt-4">
            Phone: +919503576191<br />
            Email: srthk44@gmail.com
          </p>
        </div>

      </div>
    </>
  );
};

export default FAQs;