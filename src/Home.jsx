import { Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const getGoogleAuthUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env;
  const url = `https://accounts.google.com/o/oauth2/v2/auth`;
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
    promt: 'consent',
    access_type: 'offline',
  };
  const queryString = new URLSearchParams(query).toString();
  return `${url}?${queryString}`;
};

const googleOauthUrl = getGoogleAuthUrl();

export default function Home() {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.reload();
  };
  return (
    <>
      <div>
        <span>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </span>
        <span>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </span>
      </div>
      <h1>Google Oauth 2.0</h1>

      <p className="read-the-docs">
        {isAuthenticated ? (
          <>
            <span>Hello my friend, you are logged in.</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to={googleOauthUrl}>Login with Google</Link>
        )}
      </p>
    </>
  );
}
