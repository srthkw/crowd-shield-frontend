import React from 'react'
import {useEffect, useRef, useState } from "react";
import LogoutBTN from './buttons/LogoutBTN';
import CreateEVNT from './buttons/CreateEVNT';

const Navbar = () => {

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

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
        <div className="sticky top-0 w-full z-50 flex justify-between p-3 content-center m-0 glass-bg bg-white/45 rounded-none">
            <h3 className="text-black/80 text-xl font-bold">
                Crowd-Shield
            </h3>
            <div ref={menuRef}>
                <button
                    onClick={() => setOpen(!open)}
                    className="text-black/80 text-xl m-0 cursor-pointer"
                >
                    ☰
                </button>

                {/* MOBILE DROPDOWN MENU */}
                {open && (
                    <div className="absolute z-10 top-13 right-0 rounded-tr-none bg-stone-100 border-1 border-white/40 backdrop-blur-sm p-4 rounded-xl flex flex-col gap-2 justify-center shadow-lg items-center">
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
                        <CreateEVNT />
                        <div className="border-b border-black/30 w-full my-0 relative z-1 left-1/2 -translate-x-1/2"></div>
                        <LogoutBTN />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
