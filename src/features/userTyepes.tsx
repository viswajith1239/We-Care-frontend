export interface User {
  profileImage: string;
    id?: string;
     name: string;
     phone: string;
     email: string;
     password: string;
     dob?:string
     gender?: string,
     isBlocked?: boolean;
   }

   export interface UserState {
    userInfo: User | null;  
    loading: boolean;       
    error: string | null;   
    token:string|null;
   
  }