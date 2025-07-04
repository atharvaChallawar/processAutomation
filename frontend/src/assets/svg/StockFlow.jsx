import * as React from "react"

function StockFlow(props) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 0c1.105 0 2 .995 2 2.222v3.334h4c1.105 0 2 .994 2 2.222v10C20 19.005 19.105 20 18 20H2c-1.105 0-2-.995-2-2.222V11.11C0 9.884.895 8.89 2 8.89h4V2.222C6 .995 6.895 0 8 0h4zm0 2.222H8v15.556h4V2.222zm6 5.556h-4v10h4v-10zM6 11.11H2v6.667h4V11.11z"
        fill="#fff"
      />
    </svg>
  )
}

export default StockFlow
