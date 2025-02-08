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