import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcSearch, FcPhone, FcSpeaker, FcGlobe } from "react-icons/fc";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "Emergency location sharing",
      description: "Share your location with emergency responders",
      icon: <FcGlobe />
    },
    {
      title: "Lost & Found Reporting",
      description: "Quickly report and find lost items during large events",
      icon: <FcSearch />
    },
    {
      title: "Announcements",
      description: "Real-time broadcast alerts for emergency scenarios",
      icon: <FcSpeaker />
    },
    {
      title: "Emergency Helplines",
      description: "Access important contacts during emergency",
      icon: <FcPhone />
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse top-20 -left-48" />
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000 bottom-20 -right-48" />
        <div className="absolute w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-500 top-1/2 left-1/3" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/10 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-2xl">CS</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Crowd-Shield
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <span className="inline-block px-6 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium">
              Full-Stack Event Management Platform
            </span>
          </div>

          {/* Main Title */}
          <div className="text-center mb-12 animate-fade-in-up animation-delay-200">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Secure, Scalable &</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Intelligent Event Management
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A comprehensive platform designed for large public events and emergency scenarios. 
              Built with modern technologies for reliability and scalability.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-6 mb-20 animate-fade-in-up animation-delay-400">
            <button
              onClick={() => navigate('/login')}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 hover:border-white/40"
            >
              Sign-up
            </button>
          </div>

          {/* Features Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:transform hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full w-12 h-12 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Animated underline */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform transition-transform duration-300 ${hoveredFeature === index ? 'scale-x-100' : 'scale-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative bottom element */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>Ready to protect your crowd</span>
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;