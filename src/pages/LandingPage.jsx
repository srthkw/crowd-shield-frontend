import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Emergency location sharing",
      description: "Share your location with emergency responders for faster assistance"
    },
    {
      title: "Lost & Found Reporting",
      description: "Quickly report and find lost items during large events"
    },
    {
      title: "Announcements",
      description: "Real-time broadcast alerts for emergency scenarios"
    },
    {
      title: "Emergency Helplines",
      description: "Access important contacts for emergency services and support"
    },
  ];

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 overflow-hidden">
  {/* Animated background elements - Lighter version */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-teal-300/10 rounded-full blur-3xl animate-pulse delay-500" />
    
    {/* Grid pattern - Lighter */}
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px),
                        linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
    </div>
  </div>

  {/* Navigation - Lighter */}
  <nav className="relative z-10 px-6 py-4 md:py-6 md:px-12">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center justify-center md:justify-start gap-3 w-full">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">CS</span>
        </div>
        <span className="md:text-4xl text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Crowd-Shield
        </span>
      </div>
    </div>
  </nav>

  {/* Hero Section - Lighter */}
  <main className="relative z-10 px-4 md:px-12 py-3 md:py-10">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          <div className="mb-6">
            <div className="flex justify-center md:justify-start">
            <span className="inline-block px-3 md:px-4 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium mb-6 border border-blue-200/50">
              Full-Stack Event Management Platform
            </span>
            </div>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Secure, Scalable &<br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Intelligent Event Management
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              A comprehensive platform designed for large public events and emergency scenarios. 
              Built with modern technologies for reliability and scalability.
            </p>
          </div>

          {/* CTA Buttons - Lighter */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:mb-12">
            <button
              onClick={() => {
                console.log("Bro!")
                navigate('/login')}}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-2.5 bg-white text-gray-800 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-300 hover:border-gray-400 shadow-sm"
            >
              Sign-up
            </button>
          </div>
        </div>

        {/* Right Content - Features Carousel - Lighter */}
        <div className="flex-1 max-w-lg">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 md:p-8 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 p-3">Core Features :</h3>
            
            <div className="md:space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-xl transition-all duration-500 bg-gradient-to-r from-blue-50 to-purple-50`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 md:h-10 h-7 rounded-lg flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-blue-500 to-purple-500`}>
                      <span className={`font-bold text-xs md:text-base text-white`}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-medium text-sm md:text-base transition-all duration-300 text-gray-700`}>
                        {feature.title}
                      </h4>
                      <p className={`text-sm transition-all duration-300 text-gray-600`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

</div>
  );
};

export default LandingPage;