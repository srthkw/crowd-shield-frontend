import React from 'react'
import { useRef, useEffect, useState } from "react";
import LogoutBTN from './buttons/LogoutBTN';
import CreateEVNT from './buttons/CreateEVNT';

const Navbar = () => {

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(true);
            } else if (open) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="sticky top-0 w-full z-50 flex justify-between p-3 content-center m-0 mb-2 bg-[#fef2f2]">
            <h3 className="text-black/50 text-xl font-bold">
                Crowd-Shield
            </h3>
            <div>
                <button
                    onClick={() => setOpen(!open)}
                    className="text-black/50 text-xl m-0"
                >
                    ☰
                </button>

                {/* MOBILE DROPDOWN MENU */}
                {open && (
                    <div ref={menuRef} className="absolute z-10 top-14 right-4 bg-white/30 border-1 border-white/40 backdrop-blur-sm p-4 rounded-xl flex flex-col gap-2 justify-center shadow-lg items-center">
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
                        <LogoutBTN />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
