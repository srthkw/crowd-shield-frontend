import React from 'react'
import API from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";

const CreateEVNT = () => {

    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="w-full">
            {(user.role === "admin" || user.role === "organizer") && (
                <button
                    className="glass-btn sm:text-sm text-xs p-2 w-full px-3 font-semibold flex justify-center align-middle"
                    onClick={() => navigate("/events/create")}
                >
                    <FiPlusCircle className="size-4 mr-2 mt-0.5"/>Create an event
                </button>
            )}
        </div>
    )
}

export default CreateEVNT
