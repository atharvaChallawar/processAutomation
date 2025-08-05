import { div } from 'framer-motion/client'
import React from 'react'
import AlertTab from'../insights/Alerts/ALertTab';

function StockAlerts() {
  return (
    <div className='flex-1 ml-2 bg-[#1B1B1B] h-screen overflow-y-auto'>
      <div className="flex justify-start items-start w-max mt-5 px-10 py-3 bg-[#1A1F1A] 
                      text-white font-bold text-xl shadow-lg max-w-[90%] md:max-w-[60%] mx-auto 
                      text-center">
        <span className="text-[#28A263] font-jakarta text-2xl">Stock Alerts</span> : Alerts & Notifications
      </div>
      <div className='flex flex-col gap-3 mt-10 mx-11'>
        <h1 className="text-[#28A263] font-semibold text-4xl drop-shadow-[2px_2px_0px_white]">
          ALERTS & NOTIFICATIONS
        </h1>
        <div>
          <AlertTab/>
        </div>
      </div>
    </div>
  )
}

export default StockAlerts