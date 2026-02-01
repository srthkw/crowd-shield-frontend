import React from 'react'
import { useEffect, useRef, useState } from "react";
import LogoutBTN from './buttons/LogoutBTN';
import CreateEVNT from './buttons/CreateEVNT';
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

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
        <div className="sticky top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">CS</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                                <span className={`absolute h-0.5 w-6 bg-gray-700 transition-all duration-300 ${open ? 'top-2 rotate-135' : 'top-0'
                                    }`}></span>
                                <span className={`absolute h-0.5 w-6 bg-gray-700 transition-all duration-300 top-2 ${open ? 'opacity-0' : 'opacity-100'
                                    }`}></span>
                                <span className={`absolute h-0.5 w-6 bg-gray-700 transition-all duration-300 ${open ? 'top-2 -rotate-135' : 'top-4'
                                    }`}></span>
                            </div>
                        </button>

                        {/* Mobile Dropdown Menu */}
                        <div className={`absolute -right-3.5 md:-right-5 top-12 md:top-13 bg-white rounded-xl shadow-lg border border-gray-200 min-w-[200px] transition-all duration-300 overflow-hidden ${open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                            }`}>
                            <div className="p-4 space-y-3">
                                <CreateEVNT />
                                <div className="h-px bg-gray-200"></div>
                                <LogoutBTN />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
