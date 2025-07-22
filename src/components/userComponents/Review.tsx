import { useEffect, useState, lazy, Suspense } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IReview } from "../../types/user";
import { getDoctorReview } from "../../service/userService";

const ReviewCard = lazy(() => import("./ReviewCard"));

interface ReviewProps {
  doctorId: string | undefined;
  reload: boolean;
  currentUser: string | undefined;
  onReviewCheck: (hasReview: boolean) => void;
}

function Review({ doctorId, reload, currentUser, onReviewCheck }: ReviewProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [currentCard, setCurrentCard] = useState(1);

  const reviewShows = 2;
  const indexOfLastCard = currentCard * reviewShows;
  const indexOfFirstCard = indexOfLastCard - reviewShows;
  const currentReviewCards = reviews.slice(indexOfFirstCard, indexOfLastCard);

  const arrowRight = () => {
    if (currentCard < Math.ceil(reviews.length / reviewShows)) {
      setCurrentCard(currentCard + 1);
    }
  };

  const arrowLeft = () => {
    if (currentCard > 1) {
      setCurrentCard(currentCard - 1);
    }
  };

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorReviews = async (doctorId: string) => {
      const response = await getDoctorReview(doctorId);
      setReviews(response.data);

      const userHasReviewed = response.data.some((review: IReview) => {
        if (typeof review.userId === "string") {
          return review.userId === currentUser;
        } else {
          return review.userId._id === currentUser;
        }
      });

      onReviewCheck(userHasReviewed);
    };

    fetchDoctorReviews(doctorId);
  }, [reload, doctorId, currentUser, onReviewCheck]);


  return (
    <>
      <div className="flex justify-center p-10 gap-5 flex-wrap">
        <Suspense fallback={<div>Loading reviews...</div>}>
          {currentReviewCards.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </Suspense>
      </div>

      {currentReviewCards.length > 0 && (
        <div className="flex justify-center gap-10 mb-6  -mt-7">
          <FaArrowLeft className="h-7 w-7 text-gray-500 cursor-pointer " onClick={arrowLeft} />
          <FaArrowRight className="h-7 w-7 text-gray-500 cursor-pointer" onClick={arrowRight} />
        </div>
      )}
    </>
  );
}

export default Review;
