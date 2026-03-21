import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Crowd-Shield?",
      answer: "Crowd-Shield is a web-based platform that provides essential services during public gatherings, including emergency location sharing, announcements, lost-and-found support, and access to emergency helplines—all in one place."
    },
    {
      question: "Do I need to install an app to use Crowd-Shield?",
      answer: "No. Crowd-Shield is fully browser-based, so it can be accessed directly without downloading or installing any application."
    },
    {
      question: "Does Crowd-Shield manage or control crowds?",
      answer: "No. Crowd-Shield does not manage or control crowd movement. It is designed to provide support services that improve communication and accessibility during public gatherings."
    },
    {
      question: "How does the emergency feature work?",
      answer: "When a user activates the emergency button, their location is shared with event organizers, allowing them to respond more quickly to the situation."
    },
    {
      question: "Who receives emergency alerts?",
      answer: "Emergency alerts are sent to authorized organizers or administrators associated with the event."
    },
    {
      question: "How does the lost and found system work?",
      answer: "Users can report lost items or browse items that have been found. This increases the chances of recovering belongings during crowded events."
    },
    {
      question: "Who can post announcements?",
      answer: "Announcements are role-based: Administrators can post announcements across all events, and Organizers can post announcements for events they manage."
    },
    {
      question: "What kind of announcements can be shared?",
      answer: "Organizers and administrators can share important updates such as safety instructions, event information, or emergency notices."
    },
    {
      question: "How do emergency helplines work?",
      answer: "The platform provides a list of important national emergency contacts. Users can directly initiate a call through their device by selecting a helpline."
    },
    {
      question: "Is Crowd-Shield free to use?",
      answer: "Yes, Crowd-Shield can be accessed and used without any installation or payment requirements."
    },
    {
      question: "Does the platform work without an internet connection?",
      answer: "No. Crowd-Shield requires an active internet connection to function properly."
    },
    {
      question: "Is my location data stored permanently?",
      answer: "Location data is used only during emergency situations and is handled as per system design. Data is not stored permanently and is only used for immediate emergency response."
    },
    {
      question: "Can anyone use Crowd-Shield?",
      answer: "Yes. Anyone attending a public gathering can use the platform. However, certain features like announcements are restricted to authorized roles."
    },
    {
      question: "What are the limitations of Crowd-Shield?",
      answer: "Requires internet connectivity, depends on active user participation, and is not integrated with official government emergency systems."
    },
    {
      question: "Can this system be expanded in the future?",
      answer: "Yes. Future improvements may include real-time updates, volunteer coordination, and integration with official event or emergency services."
    }
  ];

  const callSupport = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  }

  const emailSupport = (email) => {
    window.location.href = `mailto:${email}`;
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-600 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about Crowd-Shield and how it helps during public gatherings
            </p>
            <div className="mt-4 h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-4 focus:outline-none cursor-pointer"
                  aria-expanded={openIndex === index}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 pr-8">
                      {faq.question}
                    </h3>
                    <span className="text-indigo-600 text-2xl flex-shrink-0 ml-4">
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </div>
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-4 pt-2">
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support Section */}
          <div className="mt-12 bg-cyan-500 rounded-xl p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Still have questions?
            </h2>
            <p className="text-indigo-100 mb-6">
              Can't find the answer you're looking for? Please reach out to our support team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => callSupport('+919503576191')} className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-300 shadow-md cursor-pointer">
              Call Us
            </button>
            <button onClick={() => emailSupport('srthk44@gmail.com')} className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-300 shadow-md cursor-pointer">
              Mail Us
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQs;