import React from 'react'
import API from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import BtnStyle from './BtnStyle';
const LogoutBTN = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    
    return (
        <button onClick={handleLogout}>
            <BtnStyle title={<span className="flex items-center"><div><FiLogOut className="size-4 mr-2 mt-0.5" /></div>Logout</span>}/>
        </button>
    )
}

export default LogoutBTN
