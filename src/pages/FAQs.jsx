import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const FAQs = () => {
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const callSupport = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const emailSupport = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const faqs = [
    {
      id: 1,
      question: "What is Crowd-Shield?",
      answer: "Crowd-Shield is a web-based platform that provides essential services during public gatherings, including emergency location sharing, announcements, lost-and-found support, and access to emergency helplines—all in one place.",
      category: "General"
    },
    {
      id: 2,
      question: "Do I need to install an app to use Crowd-Shield?",
      answer: "No. Crowd-Shield is fully browser-based, so it can be accessed directly without downloading or installing any application.",
      category: "General"
    },
    {
      id: 3,
      question: "Does Crowd-Shield manage or control crowds?",
      answer: "No. Crowd-Shield does not manage or control crowd movement. It is designed to provide support services that improve communication and accessibility during public gatherings.",
      category: "General"
    },
    {
      id: 4,
      question: "How does the emergency feature work?",
      answer: "When a user activates the emergency button, their location is shared with event organizers, allowing them to respond more quickly to the situation.",
      category: "Features"
    },
    {
      id: 5,
      question: "Who receives emergency alerts?",
      answer: "Emergency alerts are sent to authorized organizers or administrators associated with the event.",
      category: "Features"
    },
    {
      id: 6,
      question: "How does the lost and found system work?",
      answer: "Users can report lost items or browse items that have been found. This increases the chances of recovering belongings during crowded events.",
      category: "Features"
    },
    {
      id: 7,
      question: "Who can post announcements?",
      answer: "Announcements are role-based: Administrators can post announcements across all events, while Organizers can post announcements for events they manage.",
      category: "Roles"
    },
    {
      id: 8,
      question: "What kind of announcements can be shared?",
      answer: "Organizers and administrators can share important updates such as safety instructions, event information, or emergency notices.",
      category: "Features"
    },
    {
      id: 9,
      question: "How do emergency helplines work?",
      answer: "The platform provides a list of important national emergency contacts. Users can directly initiate a call through their device by selecting a helpline.",
      category: "Features"
    },
    {
      id: 10,
      question: "Is Crowd-Shield free to use?",
      answer: "Yes, Crowd-Shield can be accessed and used without any installation or payment requirements (unless you plan otherwise later).",
      category: "General"
    },
    {
      id: 11,
      question: "Does the platform work without an internet connection?",
      answer: "No. Crowd-Shield requires an active internet connection to function properly.",
      category: "Technical"
    },
    {
      id: 12,
      question: "Is my location data stored permanently?",
      answer: "Location data is used only during emergency situations and is handled as per system design. It is not stored permanently unless required for incident reporting.",
      category: "Privacy"
    },
    {
      id: 13,
      question: "Can anyone use Crowd-Shield?",
      answer: "Yes. Anyone attending a public gathering can use the platform. However, certain features like announcements are restricted to authorized roles.",
      category: "General"
    },
    {
      id: 14,
      question: "What are the limitations of Crowd-Shield?",
      answer: "Requires internet connectivity, depends on active user participation, and is not integrated with official government emergency systems.",
      category: "Technical"
    },
    {
      id: 15,
      question: "Can this system be expanded in the future?",
      answer: "Yes. Future improvements may include real-time updates, volunteer coordination, and integration with official event or emergency services.",
      category: "General"
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleQuestion = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  // Icons
  const ChevronIcon = ({ isOpen }) => (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg">
              Everything you need to know about Crowd-Shield
            </p>
          </div>

          {/* FAQs List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No questions found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                >
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </span>
                    <ChevronIcon isOpen={openQuestionId === faq.id} />
                  </button>

                  {openQuestionId === faq.id && (
                    <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
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
      </div>
    </>
  );
};

export default FAQs;