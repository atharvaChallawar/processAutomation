import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import React from 'react';
import Logo from '../../../assets/svg/Logo';
import Back_button from '../../../assets/svg/Back_button';
import DashboardLogo from '../../../assets/svg/Dashboard_logo';
import StockOps from '../../../assets/svg/StockOps_logo';
import StockAlerts from '../../../assets/svg/StockAlerts';
import StockFlow from '../../../assets/svg/StockFlow';

function SideBar1() {
  const [open, setOpen] = useState(true);

  const Menus = [
    { title: "DashBoard", src: DashboardLogo, path: "/" },
    { title: "StockOps", src: StockOps, path: "/StockOps" },
    { title: "StockAlerts", src: StockAlerts, path: "/StockAlerts" },
    { title: "StockFlow", src: StockFlow, path: "/StockFlow" },
  ];

  return (
    <div className="flex">
      <div
        className={`${open ? "w-72" : "w-20"} 
        duration-300 h-screen bg-[#1b1b1b] text-white flex flex-col p-3 rounded-r-xl relative`}
      >
        <Back_button
          className={`absolute cursor-pointer top-5 right-0.5 w-7 h-7 transition-transform duration-300 ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex items-center space-x-3">
          <Link to="/">
            <Logo className={`cursor-pointer duration-300 ${open && "rotate-[360deg]"}
              ${!open ? "w-8 h-8" : "w-12 h-12"}`} />
          </Link>
          <h1
            className={`text-2xl font-bold text-[#28A263] transition-all duration-300 overflow-hidden ${
              !open ? "w-0" : "w-40"
            }`}
          >
            ANALYTICS
          </h1>
        </div>
        <ul className="mt-6">
          {Menus.map((menu, index) => (
            <li key={index}>
              <NavLink
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center mb-4 gap-x-4 p-2 rounded-md transition-colors duration-200 ${
                    isActive ? " text-[#28A263] text-xl font-bold" : "hover:bg-[#28A263] font-semibold"
                  }`
                }
              >
                <menu.src className={`w-6 h-6 min-w-[24px] ${!open ? "mx-auto" : ""}`} />
                <span
                  className={`transition-all duration-300 ${
                    !open ? "opacity-0 w-0" : "opacity-100 w-auto"
                  }`}
                >
                  {menu.title}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SideBar1;
