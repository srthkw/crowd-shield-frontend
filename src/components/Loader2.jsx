import React from 'react'

const Loader2 = () => {
    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse [animation-delay:150ms]" />
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-pulse [animation-delay:300ms]" />
        </div>
    )
}

export default Loader2
