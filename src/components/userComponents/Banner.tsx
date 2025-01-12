import React from 'react';
import Banner_img from "../../assets/pexels-shvetsa-4421494.jpg";
import { useNavigate } from 'react-router-dom';

function Banner() {

    const navigate=useNavigate()
    function doctorlogin(event:React. MouseEvent<HTMLButtonElement>): void {
        navigate("/doctor/login")
        throw new Error('Function not implemented.');
      }
  return (
    <div
  className="h-[900px] bg-no-repeat bg-cover relative"
  style={{
    backgroundImage: `url(${Banner_img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Color overlay */}
  <div className="absolute inset-0 bg-[#00897B] bg-opacity-30"></div>

  {/* Content */}
  <div className="relative w-[90%] mx-auto flex items-center justify-between flex-col">
    <div className="lg:w-fit mr-[35.2rem] ">
      <div className="w-full lg:w-4/5 space-y-5 mt-10 text-white">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight max-w-[600px] text-left mr-30">
          Transforming Health for a Better Future
        </h1>
        </div>
        <div className='mr-30'>
        <p className="text-base font-normal leading-relaxed mt-4 max-w-[600px] text-left text-white">
          Your Health, Our Priority. WeCare is dedicated to offering
          comprehensive healthcare solutions. From expert advice to easy
          appointment scheduling and record management, we ensure your
          well-being is our top focus every step of the way.
        </p>
        </div>
        <button
        onClick={doctorlogin}
        className="text-white bg-[#1F2937] font-medium rounded-lg text-lg leading-8 px-8 py-3 cursor-pointer text-left ml-0 mt-4 mr-[23rem]"
      >
        Are you a Doctor ?
      </button>
    </div>
  </div>
</div>

  );
}

export default Banner;
