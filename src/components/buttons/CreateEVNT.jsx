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
                    className="text-black/80 sm:text-sm text-sm p-1 w-full font-semibold flex items-center justify-center align-middle cursor-pointer"
                    onClick={() => navigate("/events/create")}
                >
                    <FiPlusCircle className="size-4 mr-2 mt-0.5"/><span>Create an event</span>
                </button>
            )}
        </div>
    )
}

export default CreateEVNT