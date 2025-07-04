// src/Components/compos/Layout.jsx
import React from 'react';
import Sidebar from '../SideBar/SideBar1';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className='bg-[rgb(20,20,20)] min-h-screen text-white flex'>
      <Sidebar className="h-screen overflow-y-auto"/>
      <div className="flex-1 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;