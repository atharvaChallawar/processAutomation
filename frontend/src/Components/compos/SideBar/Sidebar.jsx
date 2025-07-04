import React from "react";
import Logo from "../../../assets/svg/Logo";
import DashboardLogo from "../../../assets/svg/Dashboard_logo";
import { aside } from "framer-motion/client";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#1b1b1b] text-white flex flex-col p-4 rounded-2xl">
      <div className="flex items-center space-x-3">
        <Logo width="40px" height="40px" />
        <h1 className="text-2xl font-bold text-[#28A263]">
          ANALYTICS
        </h1>
      </div>
        <div className="mt-10 flex items-center space-x-3">
          <DashboardLogo width="30px" height="30px" />
        <h1 className="text-lg font-semibold text-green-500">Dashboard</h1>
        </div>
        <div className="mt-10 flex items-center space-x-3 border-green-500 border-2 rounded-3xl p-3">
        </div>
    </div>
  );
}

export default Sidebar;
