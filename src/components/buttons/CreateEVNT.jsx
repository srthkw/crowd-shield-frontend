import React from 'react'
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import BtnStyle from './BtnStyle';

const CreateEVNT = () => {

    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(`/create-event`)}>
            <BtnStyle title={<span className="flex items-center"><div><FiPlusCircle className="size-4 mr-2 mt-0.5" /></div>Create Event</span>} />
        </button>
    )
}

export default CreateEVNT