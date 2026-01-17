import React from 'react'
import API from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
const LogoutBTN = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    
    return (
        <div className="w-full">
            <button onClick={handleLogout} className="text-black/80 sm:text-sm text-sm p-1 w-full font-semibold flex items-center justify-center align-middle cursor-pointer">
            <FiLogOut className="size-4 mr-2 mt-0.5" /><span>Logout</span>
            </button>
        </div>
    )
}

export default LogoutBTN
