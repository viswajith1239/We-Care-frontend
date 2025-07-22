import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner_img from "../../assets/pexels-shvetsa-4421494.jpg";
import Banner_img3 from "../../assets/doctor-nurses-special-equipment.jpg";

function Banner() {
  const navigate = useNavigate();


  const bannerSlides = [
    {
      image: Banner_img,
      title: "Transforming Health for a Better Future",
      description: "Your Health, Our Priority. WeCare is dedicated to offering comprehensive healthcare solutions. From expert advice to easy appointment scheduling and record management, we ensure your well-being is our top focus every step of the way."
    },
    {
      image: Banner_img3,
      title: "Expert Healthcare Professionals At Your Service",
      description: "Our team of dedicated doctors and nurses provide personalized care with the latest medical technology. We're committed to delivering the highest quality healthcare services to improve your quality of life."
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);


  function doctorLogin(event: React.MouseEvent<HTMLButtonElement>): void {
    navigate("/doctor/login");
  }


  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };


  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === bannerSlides.length - 1 ? 0 : prevIndex + 1
    );
  };


  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[900px] relative overflow-hidden">

      <div className="h-full w-full relative">
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full bg-no-repeat bg-cover transition-opacity duration-500"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentSlideIndex === index ? 1 : 0,
              zIndex: currentSlideIndex === index ? 1 : 0
            }}
          >

            <div className="absolute inset-0 bg-[#00897B] bg-opacity-30"></div>


            <div className="absolute inset-0 flex items-start justify-center">
              <div className="relative w-[90%] mx-auto flex items-center justify-between flex-col h-full">
                <div className="lg:w-fit mr-[35.2rem] mt-20">
                  <div className="w-full lg:w-4/5 space-y-5 text-white">
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight max-w-[600px] text-left mr-30">
                      {slide.title}
                    </h1>
                  </div>
                  <div className='mr-30'>
                    <p className="text-base font-normal leading-relaxed mt-4 max-w-[600px] text-left text-white">
                      {slide.description}
                    </p>
                  </div>
                  <button
                    onClick={doctorLogin}
                    className="text-white bg-[#1F2937] font-medium rounded-lg text-lg leading-8 px-8 py-3 cursor-pointer text-left ml-0 mt-4 mr-[23rem]"
                  >
                    Are you a Doctor?
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-10">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full ${currentSlideIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
              } transition-all duration-300 hover:bg-white`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>


      <div className="absolute inset-y-0 left-0 flex items-center z-10">
        <button
          onClick={() => setCurrentSlideIndex(prev => prev === 0 ? bannerSlides.length - 1 : prev - 1)}
          className="bg-black bg-opacity-30 text-white p-2 rounded-r-lg hover:bg-opacity-50 transition-all"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center z-10">
        <button
          onClick={nextSlide}
          className="bg-black bg-opacity-30 text-white p-2 rounded-l-lg hover:bg-opacity-50 transition-all"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Banner;