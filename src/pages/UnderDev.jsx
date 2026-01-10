import React from 'react'

const UnderDev = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen text-black bg-white">
      <h1 className="text-3xl font-bold mb-4">This page is under development</h1>
      <h2 className="text-lg">Use these credentials to login and test this project:</h2>
      <p className="mt-4 text-green-700">Username: user@gmail.com</p>
      <p className="text-green-700">Password: pass</p>
    </div>
  )
}

export default UnderDev
