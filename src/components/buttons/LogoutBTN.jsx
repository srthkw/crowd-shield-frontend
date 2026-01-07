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
        navigate("/");
    };
    
    return (
        <div className="w-full">
            <button onClick={handleLogout} className="glass-btn sm:text-sm text-xs p-2 w-full px-3 font-semibold flex justify-center align-middle">
            <FiLogOut className="size-3 mr-2 mt-0.5" />Logout
            </button>
        </div>
    )
}

export default LogoutBTN
