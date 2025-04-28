import { useEffect, useState } from "react";
import {} from "react-icons";
import { FaArrowLeft, FaArrowRight,} from "react-icons/fa";
import userAxiosInstance from "../../axios/userAxiosInstance";
import { IReview } from "../../types/user";
import img from "../../assets/user.png"
import API_URL from "../../axios/API_URL";

interface ReviewProps {
  doctorId: string | undefined;
  reload: boolean; 
  currentUser: string | undefined
  onReviewCheck: (hasReview: boolean) => void
}
function Review({ doctorId, reload, currentUser, onReviewCheck }: ReviewProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [currentCard, setCurrentCard] = useState(1)

  const reviewShows = 3;
  const indexOfLastCard = currentCard * reviewShows
  const indexOfFirstCard = indexOfLastCard -  reviewShows
  const currentReviewCards = reviews.slice(indexOfFirstCard, indexOfLastCard)

  const arrowRight = () => {
    if(currentCard < Math.ceil(reviews.length / reviewShows)) {
      setCurrentCard(currentCard + 1)
    }
  }


  const arrowLeft = () => {
    if(currentCard > 1) {
      setCurrentCard(currentCard -1)
    }
  }

  useEffect(() => {
    const fetchDoctorReviews = async () => {
      const response = await userAxiosInstance.get(
        `${API_URL}/user/reviews/${doctorId}`
      );
      console.log(",,,,,,",response);
      
      setReviews(response.data);
      const userHasReviewed = response.data.some((review: IReview) => {
        if (typeof review.userId === "string") {
          return review.userId === currentUser;
        } else {
          return review.userId._id === currentUser;
        }
      });
      
      console.log("mmmm",userHasReviewed)
      onReviewCheck(userHasReviewed)
    };
    fetchDoctorReviews();
  }, [reload,doctorId, currentUser ,onReviewCheck]);


  const renderRatingStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if(i <= rating) {
        stars.push(
          <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-yellow-600"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          ></path>
        </svg>
        )
      } else {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-300"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            ></path>
          </svg>
        )
      }
    }
    return  stars;
  }

  console.log("bbbbbb",reviews)

  return (
    <>
      <div className="flex justify-center p-10 gap-5">
        {
          currentReviewCards?.map((review) => (
            <div className="flex w-full p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm border border-slate-200 my-6">
            <div className="flex items-center gap-4 text-slate-800">
              <img
                src={review.userImage||img}
                alt="Tania Andrew"
                className="relative inline-block h-[58px] w-[58px] !rounded-full  object-cover object-center"
              />
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-between">
                  <h5 className="text-xl font-semibold text-slate-800">
                  {typeof review.userId === "object" ? review.userId.name : "User"}
                  </h5>

                  <div className="flex items-center gap-1">
                    {renderRatingStars(review.rating)}
                  </div> 

                </div>
                
              </div>
            </div>
            <div className="mt-6">
              <p className="text-base text-slate-600 font-light leading-normal">
              {review.comment}
              </p>
            </div>
          </div>
          ))
        }

      </div>
      {currentReviewCards.length >0 && (
       <div className="flex justify-center gap-10">
       <FaArrowLeft className="h-7 w-7 text-gray-500 cursor-pointer" onClick={arrowLeft} />
       <FaArrowRight className="h-7 w-7 text-gray-500 cursor-pointer" onClick={arrowRight} />
     </div>
     
      )}
    </>
  );
}

export default Review;