import { useLocation } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import useToken from './auth/useToken';
import Page404 from './pages/Page404';

import Dashboard from './Components/Dashboard';

import { useEffect, useState } from 'react';


function App() {
  const location = useLocation();
  const { token, setToken } = useToken();
  const [decodedToken, setDecodedToken] = useState()
  useEffect(() => {
    setDecodedToken(decodeToken(token));
  }, [token])


  if (location.pathname === "/404") return <Page404 />

  if (location.pathname === "/signup") {
    return <SignUp />
  }
  if (location.pathname === "/signin") {
    return <SignIn setToken={setToken} />
  }

  // console.log("token", token)

  if (!token) {
    return <SignIn setToken={setToken} />;
  }

  if (isExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('shouldLoad');
    return <SignIn setToken={setToken} />;
  }
  if (decodedToken) return <Dashboard />
  return <Page404 />
}

export default App;




