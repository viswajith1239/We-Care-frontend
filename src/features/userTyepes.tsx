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
    showIncomingVideoCall: any | null; 
    videoCall: null | string;
    showVideoCallUser: boolean;
    roomIdUser: null | string;
   
  }

   export interface IncomingVideoCall {
    _id: string | null;
    callType: string;
    doctorName: string
    doctorImage: string
    roomId: string  | null;
  }