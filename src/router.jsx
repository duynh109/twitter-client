import { createBrowserRouter } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import VefiryEmail from './VerifyEmail';

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
]);

export default router;
