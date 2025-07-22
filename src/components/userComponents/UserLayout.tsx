import React from 'react'
import { Outlet } from 'react-router-dom';
import UserProfileSidebar from './UserProfileSidebar';
import Header from './Header';
function UserLayout() {
  return (
    <div className="flex flex-col  h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden ">

        <UserProfileSidebar />
        <div className="flex-1 p-6 bg-slate-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserLayout
