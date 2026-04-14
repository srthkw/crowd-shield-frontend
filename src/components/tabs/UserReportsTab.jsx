import React, { useState, useEffect } from 'react'
import API from '../../api/axios';


const UserReportsTab = ({ eventId, eventCreator }) => {
  ;
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/events/event-users/${eventId}`);
        const data = res.data;

        setUserData(data.users);
        console.log(res.data);
      } catch (err) {
        console.error("Failed:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="text-black">
      <h1 className={`text-3xl font-bold mb-2 text-gray-800 text-center`}>User Reports</h1>

      {userData.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div>
          <h1 className={`text-md mb-4 text-gray-600 text-center`}>{userData.length === 1 ? userData.length + " user" : userData.length + " users"} registered for this event</h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
            {userData.map((user) => (
              <div key={user._id} className={`group flex items-center gap-3 p-2 rounded-lg bg-white border-l-5 shadow-md hover:shadow-lg transition-all duration-300 ${user._id === eventCreator ? " border-green-500" : "border-sky-500"}`}>
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-gray-600 text-lg font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <div className="flex flex-col gap-0.5 pt-0.5 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-500 truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-500">{user.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserReportsTab
