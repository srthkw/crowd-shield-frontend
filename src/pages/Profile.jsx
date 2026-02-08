import React from 'react'
import { useAuth } from "../hooks/useAuth";
import Navbar from '../components/Navbar';

const Profile = () => {
    const { user } = useAuth();
    
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100'>
        <Navbar />
        
        <div className='max-w-4xl mx-auto p-4 md:p-6'>
          {/* Header */}
          <div className='text-center mb-8 md:mb-4'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-3'>
              Profile
            </h1>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Manage your account information and settings
            </p>
          </div>

          {/* Profile Card */}
          <div className='bg-white rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-200/30 overflow-hidden'>
            {/* Profile Header */}
            <div className='bg-gradient-to-r from-blue-500 to-purple-500 p-6 md:p-8'>
              <div className='flex flex-row items-center gap-6'>
                {/* Avatar */}
                <div className='w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-lg'>
                  <div className='text-4xl md:text-5xl font-bold text-white'>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                
                {/* User Info */}
                <div className='text-center md:text-left'>
                  <h2 className='text-2xl md:text-3xl font-bold text-white mb-2'>
                    {user.name}
                  </h2>
                  <div className='inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white font-medium rounded-full text-sm'>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className='p-6 md:p-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Email Card */}
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='p-2 rounded-lg bg-blue-100'>
                      <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                      </svg>
                    </div>
                    <h3 className='font-semibold text-gray-800'>Email Address</h3>
                  </div>
                  <p className='text-gray-700 font-medium'>{user.email}</p>
                </div>

                {/* Phone Card */}
                <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='p-2 rounded-lg bg-purple-100'>
                      <svg className='w-5 h-5 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                      </svg>
                    </div>
                    <h3 className='font-semibold text-gray-800'>Phone Number</h3>
                  </div>
                  <p className='text-gray-700 font-medium'>{user.phone || 'Not provided'}</p>
                </div>

                {/* Account Status */}
                <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='p-2 rounded-lg bg-gray-100'>
                      <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                      </svg>
                    </div>
                    <h3 className='font-semibold text-gray-800'>User id</h3>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <span className='text-gray-700 font-medium'>{user.id}</span>
                  </div>
                </div>

                {/* Member Since */}
                <div className='bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-5 border border-teal-200'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='p-2 rounded-lg bg-teal-100'>
                      <svg className='w-5 h-5 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                    </div>
                    <h3 className='font-semibold text-gray-800'>Member Since</h3>
                  </div>
                  <p className='text-gray-700 font-medium'>
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Profile