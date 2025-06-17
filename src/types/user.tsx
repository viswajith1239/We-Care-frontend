import { Key } from "react";

export interface User {
    status: string;
    id: Key | null | undefined;
    _id: string;
    image: string
    name: string;
    email: string;
    phone: number;
    isBlocked: boolean;
  }

  export interface IReview {
    _id: Key | null | undefined;
    review_id: string
    comment: string
    rating: number
    userName: string
    userImage: string
    userId: string | { _id: string; name: string };  
  
  }
  export interface AvgRatingAndReviews {
    totalReviews: number;
    averageRating: number;
  }