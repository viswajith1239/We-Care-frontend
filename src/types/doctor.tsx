import { ReactNode } from "react";

export interface Doctor {
    //specializations: ReactNode;
    _id: string; 
    profileImage: string
    name: string; 
    email: string; 
    phone: number; 
    gender: string;
    language: string
    yearsOfExperience: string
    specializations: ISpecialization[]
    dailySessionLimit: number
    isBlocked: boolean; 
  }
  export interface ISpecialization {
    _id: string;
    name: string;
    description?: string;
    image?: string;
}

export interface IAppoinmentSchedule {
  date: ReactNode;
  specialization: string;
  _id: string;
   isSingleSession: boolean;
  type:string
  startDate: string; 
  endDate: string; 
  startTime: string;
  endTime: string;
  price: number;
  specializationId: ISpecialization
  duration?: string; 
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'InProgress'; 
  trainerId: string;
  selectedDate:string
}


export interface DoctorListFilterBarProps {
  onFilterChange: (filters: {
      specialization: string;
      gender: string;
      priceRange: [number, number];
      language: string;
  }) => void;
}
export interface Specialization {
  // image: string | undefined;
  _id: string;
  name: string;
  description: string;
  isListed: boolean
  
}

export interface ITransaction {
  amount: number;
  transactionId: string;
  transactionType: string
  date?: Date;
  bookingId?: string;
}

export interface IWallet {
  trainerId: string;
  balance: number;
  transactions: ITransaction[];
  createdAt?: Date;
  updatedAt: Date;
}