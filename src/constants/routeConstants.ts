export const USER_ROUTES = {
    HOME: '/',
    SIGNUP: '/signup',
    VERIFY_OTP: '/verifyotp',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    FORGOT_PASSWORD_OTP: '/forgot-passwordotp',
    RESET_PASSWORD: '/resetpassword',
    DOCTORS: '/doctors',
    About:'/about',
    Contact:'/contact',
    DOCTOR_PROFILE_VIEW: (doctorId = ':doctorId') => `/doctorsprofileview/${doctorId}`,
    PAYMENT_SUCCESS: '/paymentSuccess',
    PROFILE: '/profile',
    PROFILE_BOOKINGS: '/profile/bookings',
    PROFILE_MESSAGE: '/profile/message',
    PROFILE_PRESCRIPTIONS: '/profile/prescriptions',
    PROFILE_REPORTS: '/profile/reports',
   

};






export const DOCTOR_ROUTES = {
    SIGNUP: '/signup',
    OTP: '/otp',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/doctor-forgot-password',
    FORGOT_PASSWORD_OTP: '/doctor-forgot-passwordotp',
    RESET_PASSWORD: '/doctor-resetpassword',

    BASE: '/',
    DASHBOARD: '/',
    KYC: '/doctor',
    PROFILE: 'profile',
    EDIT_PROFILE: 'editProfile',
    SCHEDULE_APPOINTMENTS: 'scheduleappoinments',
    WALLET: 'wallet',
    MESSAGES: 'messages',
    BOOKINGS: 'bookings',
    REPORTS: 'reports',
    PRESCRIPTIONS: 'prescriptions',
};




export const ADMIN_ROUTES = {
    LOGIN: '/login',
    BASE: '/',
    DASHBOARD: '/',
    SPECIALIZATIONS: '/specialisations',
    USER_LISTING: '/user-listing',
    VERIFICATION: '/verification',
    DOCTOR_VIEW: (doctorId = ':doctorId') => `/doctor-view/${doctorId}`,
    ENQUIRY:'/enquiry',
};
