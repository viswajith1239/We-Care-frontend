import { Key } from "react";

export interface User {
    status: string;
    id: string
    _id: string;
    profileImage?: string
    name: string;
    email: string;
    phone: number;
    isBlocked: boolean;
  
  }

  export interface IReview {
    profileImage: string;
    _id: Key | null | undefined;
    review_id: string
    comment: string
    rating: number
    userName: string
    userImage: string
    userId: string | User;  
  
  }
  export interface AvgRatingAndReviews {
    totalReviews: number;
    averageRating: number;
  }