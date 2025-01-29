import { ScaleLoader } from "react-spinners";
// import React from 'react'

function loading() {
  return (
    <div className="absolute inset-0 h-full flex items-center justify-center bg-black bg-opacity-20 ">
    <ScaleLoader color="#4299e1" />
  </div>
  )
}

export default loading