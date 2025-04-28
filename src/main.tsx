import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import store from './app/store.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {SocketContextProvider} from "../src/context/socket.tsx"
import {NotificationProvider} from "../src/context/NotificationContext.tsx"






const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


createRoot(document.getElementById('root')!).render(
  <NotificationProvider>
  <Provider store={store}>     
    <GoogleOAuthProvider clientId={clientId}>
      <SocketContextProvider>
      <App />
      </SocketContextProvider>
    </GoogleOAuthProvider>
  </Provider> 
  </NotificationProvider>
)
