// interface UserImage {
//     url: string;
//     type: string;
//   }
  export interface User {
    _id:string;
      userId: string;
      name: string;
      phone : string;
      email: string;
      isBlocked: boolean;
      // address:string|null;
      // DOB:Date|null;
      // image:UserImage
      
    
    }