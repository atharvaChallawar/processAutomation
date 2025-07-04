import * as React from "react"

function StockAlerts(props) {
  return (
    <svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.245 2.965a6.117 6.117 0 00-6.112 6.112v2.944c0 .622-.265 1.57-.581 2.1L4.38 16.065c-.723 1.202-.224 2.537 1.1 2.985a21.313 21.313 0 0013.52 0 2.04 2.04 0 001.1-2.985l-1.172-1.946c-.306-.53-.57-1.477-.57-2.098V9.076c0-3.362-2.751-6.112-6.113-6.112z"
        stroke="#fff"
        strokeWidth={0.798183}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <path
        d="M14.13 3.26a6.88 6.88 0 00-3.77 0 2.022 2.022 0 011.885-1.284c.856 0 1.59.53 1.885 1.283z"
        stroke="#fff"
        strokeWidth={0.798183}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.302 19.418a3.065 3.065 0 01-3.056 3.056c-.836 0-1.61-.346-2.16-.896a3.067 3.067 0 01-.897-2.16"
        stroke="#fff"
        strokeWidth={0.798183}
        strokeMiterlimit={10}
      />
    </svg>
  )
}

export default StockAlerts
