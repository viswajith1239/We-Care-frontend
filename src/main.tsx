// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import store from './app/store.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>     
  
  <GoogleOAuthProvider clientId="967708167217-0fndcujmqi2l3ud1hp8c4bkij58ca1mr.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>;
    
  
</Provider>
)
