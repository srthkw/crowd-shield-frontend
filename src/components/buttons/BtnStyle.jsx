import React from 'react'

const BtnStyle = (prop) => {
  return (
    <div className="w-full">
      <button className="text-black/80 bg-gray-100/50 w-full rounded-lg sm:text-sm text-sm p-2 flex font-semibold cursor-pointer">
      <span className="flex items-center">{prop.title}</span>
      </button>
    </div>
  )
}

export default BtnStyle
