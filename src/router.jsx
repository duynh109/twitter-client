import { createBrowserRouter } from 'react-router-dom';
import Chat from './Chat';
import Home from './Home';
import Login from './Login';
import ResetPassword from './ResetPassword';
import VefiryEmail from './VerifyEmail';
import VerifyForgotPasswordToken from './VerifyForgotPasswordToken';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login/oauth',
    element: <Login />,
  },
  {
    path: '/email-verifications',
    element: <VefiryEmail />,
  },
  {
    path: '/forgot-password',
    element: <VerifyForgotPasswordToken />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
]);

export default router;
