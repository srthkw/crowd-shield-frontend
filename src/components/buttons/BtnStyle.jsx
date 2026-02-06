import React from 'react'
import { NavLink } from "react-router-dom";

const BtnStyle = ({title, to}) => {
  return (
    <div className="w-full">
      <NavLink to={to} className={({ isActive }) =>`w-full text-black/80 bg-gray-100/50 rounded-lg sm:text-sm text-sm p-2 flex font-semibold cursor-pointer transition duration-300 ${isActive ? "border-2 border-violet-300/80" : "hover:bg-gray-300/50"}`}>
      <span className="flex items-center">{title}</span>
      </NavLink>
    </div>
  )
}

export default BtnStyle
