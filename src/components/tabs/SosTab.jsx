import React from 'react'
import { FcOnlineSupport, FcDepartment, FcHighPriority, FcDisapprove } from "react-icons/fc";

const SosTab = () => {
  const emergencyNumbers = [
    { 
      id: 1, 
      number: '112', 
      name: 'All Emergencies', 
      emoji: <FcHighPriority />, 
      description: 'National emergency number for police, fire, and ambulance',
      color: 'from-red-500 to-orange-500'
    },
    { 
      id: 2, 
      number: '108', 
      name: 'Medical Emergency', 
      emoji: <FcDepartment />, 
      description: 'Emergency medical services ambulance',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 3, 
      number: '1098', 
      name: 'Child Helpline', 
      emoji: <FcDisapprove />, 
      description: '24/7 helpline for children in distress',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 4, 
      number: '1091', 
      name: 'Women Safety', 
      emoji: <FcOnlineSupport />, 
      description: 'Women helpline & anti-stalking service',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const handleEmergencyCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`
  }

  return (
    <div className="md:p-2">
      {/* Header */}
      <div className="mb-4 md:mb-8 text-center">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
          Emergency Helplines
        </h2>
        <p className="text-gray-600 max-w-2xl text-sm mx-auto">
          Tap any emergency number below to call directly. These are 24/7 active helplines.
        </p>
      </div>

      {/* Emergency Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {emergencyNumbers.map((emergency) => (
          <div
            key={emergency.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            {/* Top Gradient Border */}
            <div className={`h-1.5 bg-gradient-to-r ${emergency.color}`} />
            
            <div className="p-5">
              {/* Header with Emoji and Number */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{emergency.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">
                      {emergency.number}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {emergency.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                {emergency.description}
              </p>

              {/* Call Button */}
              <button
                onClick={() => handleEmergencyCall(emergency.number)}
                className={`w-full py-3 bg-gradient-to-r ${emergency.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md group-hover:scale-[1.02]`}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
                Call {emergency.number}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default SosTab
