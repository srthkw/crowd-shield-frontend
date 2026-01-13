import React from 'react'
import {useEffect, useRef, useState } from "react";
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
        <div className="sticky top-0 w-full z-10 flex justify-between p-3 content-center m-0 glass-bg shadow-lg shadow-black/5 bg-white/45 rounded-none">
            <h3 className="text-black/80 text-xl font-bold" onClick={() => navigate(`/`)}>
                Crowd-Shield
            </h3>
            <div ref={menuRef}>
                <button
                    onClick={() => setOpen(!open)}
                    className={`text-xl transition-transform duration-300 text-black/80 text-xl m-0 cursor-pointer ${open ? "rotate-180" : ""}`}
                    
                >
                    ☰
                </button>

                {/* MOBILE DROPDOWN MENU */}
                <div className={`absolute z-10 top-13 right-0 rounded-tr-none rounded-xl flex flex-col gap-2 justify-center shadow-lg items-center transition-h duration-900 ease-in-out overflow-hidden ${open ? "max-h-96" : "max-h-0"}`}>
                        {/* {(user.role === "admin" || user.role === "organizer") && (
                        <button
                            className="text-black/80 bg-white/70 w-full p-2 px-3 rounded-2xl font-semibold"
                            onClick={() => {
                                setOpen(false);
                                navigate("/events/create");
                            }}
                        >
                            Create an event
                        </button>
                    )} */}
                    <div className="bg-stone-100 border-1 border-white/40 backdrop-blur-sm p-4">
                        <CreateEVNT />
                        <div className="border-b border-black/30 w-full my-2 relative z-1 left-1/2 -translate-x-1/2 "></div>
                        <LogoutBTN />
                    </div>
                    </div>
            </div>
        </div>
    )
}

export default Navbar
