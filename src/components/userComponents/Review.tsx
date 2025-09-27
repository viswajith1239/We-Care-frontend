import { useEffect, useState, lazy, Suspense } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IReview } from "../../types/user";
import { getDoctorReview } from "../../service/userService";

const ReviewCard = lazy(() => import("./ReviewCard"));

interface UserReview {
  _id: string;
  comment: string;
  rating: number;
}

interface ReviewProps {
  doctorId: string | undefined;
  reload: boolean;
  currentUser: string | undefined;
  onReviewCheck: (hasReview: boolean) => void;
  onUserReviewData: (reviewData: UserReview | null) => void;
}

function Review({ doctorId, reload, currentUser, onReviewCheck, onUserReviewData }: ReviewProps) {
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
      try {
        const response = await getDoctorReview(doctorId);
        
        setReviews(response.data);

        // Check if user has reviewed and get their review data
        const userReview = response.data.find((review: IReview) => {
          if (typeof review.userId === "string") {
            return review.userId === currentUser;
          } else {
            return review.userId._id === currentUser;
          }
        });

        const userHasReviewed = !!userReview;
        onReviewCheck(userHasReviewed);

        // Pass user's existing review data to parent
        if (userReview) {
          onUserReviewData({
            _id: userReview._id,
            comment: userReview.comment,
            rating: userReview.rating
          });
        } else {
          onUserReviewData(null);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
        onReviewCheck(false);
        onUserReviewData(null);
      }
    };

    fetchDoctorReviews(doctorId);
  }, [reload, doctorId, currentUser, onReviewCheck, onUserReviewData]);

  // Don't render anything if there are no reviews
  if (reviews.length === 0) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="text-center text-gray-500">
          <p className="text-lg">No reviews yet</p>
          <p className="text-sm">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center p-10 gap-5 flex-wrap">
        <Suspense fallback={<div>Loading reviews...</div>}>
          {currentReviewCards.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </Suspense>
      </div>

      {/* Only show pagination if there are reviews and more than one page */}
      {reviews.length > reviewShows && (
        <div className="flex justify-center gap-10 mb-6 -mt-7">
          <FaArrowLeft 
            className={`h-7 w-7 cursor-pointer ${
              currentCard > 1 ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 cursor-not-allowed'
            }`} 
            onClick={arrowLeft} 
          />
          <span className="text-gray-600 text-sm flex items-center">
            {currentCard} / {Math.ceil(reviews.length / reviewShows)}
          </span>
          <FaArrowRight 
            className={`h-7 w-7 cursor-pointer ${
              currentCard < Math.ceil(reviews.length / reviewShows) 
                ? 'text-gray-500 hover:text-gray-700' 
                : 'text-gray-300 cursor-not-allowed'
            }`} 
            onClick={arrowRight} 
          />
        </div>
      )}
    </>
  );
}

export default Review;