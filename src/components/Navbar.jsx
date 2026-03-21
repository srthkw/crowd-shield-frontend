import React from 'react'
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiUser, FiPlusCircle, FiLogOut, FiHome, FiUserPlus, FiHelpCircle } from "react-icons/fi";
import BtnStyle from './buttons/BtnStyle';
import { roleGradients } from '../constants/roleGradient';

const Navbar = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [open])

    return (
        <div className="sticky top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm">
            <div className="mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleGradients[user.role]} flex items-center justify-center shadow-md`}>
                            <span className="text-white font-bold text-lg">CS</span>
                        </div>
                        <span className={`text-xl font-bold bg-gradient-to-r ${roleGradients[user.role]} bg-clip-text text-transparent`}>
                            Crowd-Shield
                        </span>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 rounded-lg transition-colors duration-200 focus:outline-none"
                            aria-label="Menu"
                        >
                            <div className="w-6 h-5 relative">
                                {/* Animated Hamburger Icon */}
                                <span className={`absolute h-0.5 w-6 bg-gray-700 transition-all duration-400 ${open ? 'top-2 rotate-225' : 'top-0'
                                    }`}></span>
                                <span className={`absolute h-0.5 w-6 bg-gray-700 transition-all duration-300 top-2 ${open ? 'opacity-0' : 'opacity-100'
                                    }`}></span>
                                <span className={`absolute h-0.5 w-6 bg-gray-700 transition-all duration-400 ${open ? 'top-2 -rotate-225' : 'top-4'
                                    }`}></span>
                            </div>
                        </button>

                        {/* Mobile Dropdown Menu */}
                        <div className={`absolute -right-3.5 md:-right-5 top-12 md:top-13 bg-gray-50 rounded-xl shadow-lg border border-gray-200 min-w-[250px] transition-all duration-300 overflow-hidden ${open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                            }`}>
                            <div className="px-3 py-2 space-y-2 flex flex-col">

                                {/* Home Button */}
                                <button onClick={() => {navigate('/events');}}>
                                    <BtnStyle title={<span className="flex items-center"><div><FiHome className="size-4 mr-2 mt-0.5" /></div>Home</span>} to={`/events`} />
                                </button>

                                {/* Profile Button */}
                                <button onClick={() => {navigate('/profile');}}>
                                    <BtnStyle title={<span className="flex items-center"><div><FiUser className="size-4 mr-2 mt-0.5" /></div>Profile</span>} to={`/profile`} />
                                </button>

                                {/* Create Event Button */}
                                {(user.role === "admin" || user.role === "organizer") &&
                                    (<button onClick={() => navigate(`/create-event`)}>
                                        <BtnStyle title={<span className="flex items-center"><div><FiPlusCircle className="size-4 mr-2 mt-0.5" /></div>Create Event</span>} to={`/create-event`} />
                                    </button>)}
                               
                                {/* Create Event Button */}
                                {(user.role === "admin" )&&
                                    (<button onClick={() => navigate(`/org-reqs`)}>
                                        <BtnStyle title={<span className="flex items-center"><div><FiUserPlus className="size-4 mr-2 mt-0.5" /></div>Organization Requests</span>} to={`/org-reqs`} />
                                    </button>)}

                                {/* FAQs Button */}
                                <button onClick={() => navigate(`/faqs`)}>
                                    <BtnStyle title={<span className="flex items-center"><div><FiHelpCircle className="size-4 mr-2 mt-0.5" /></div>FAQs</span>} to={`/faqs`} />
                                </button>

                                {/* Logout Button */}
                                <button onClick={handleLogout}>
                                    <BtnStyle title={<span className="flex items-center"><div><FiLogOut className="size-4 mr-2 mt-0.5" /></div>Logout</span>} to={`/login`} />
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
