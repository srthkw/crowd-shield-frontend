import React from 'react'
import bg from '../assets/bg.jpg'

const Bg = () => {
  return (
    <div>
            <div className="fixed inset-0 bg-black -z-50"></div>
            <div
              className="fixed inset-0 bg-cover bg-center opacity-85 z-0"
              style={{ backgroundImage: `url(${bg})` }}
            />
    </div>
  )
}

export default Bg
