// Login.js
import React, { useState } from "react";
import Axios from 'axios';
import ChannelLanding from '../ChannelLanding/chanelLanding';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    Axios.post('http://localhost:4000/login', {
      username: loginUsername,
      password: loginPassword
    }).then((response) => {
      console.log(response);
      if (response.data === "Login successful") {
        window.alert("Login successful!!!! :D");
        loginSuccess(true, loginUsername);
        navigate('/Channel');
      } else {
        window.alert("Login Failed");
      }
    }).catch((error) => {
      console.error("Error during login", error);
      window.alert("Login Failed - Error occurred");
    });
  }

  const loginSuccess = (state, username) => {
    setIsLoggedIn(state);
    setLoginUsername(username);
    onLogin(state, username);
    navigate('/Channel');
  };

  if (!isLoggedIn) {
    return (
      <div className="App">
        {/* Login */}
        <div className="login">
          <h1>Login</h1>
          <label>Username</label>
          <input
            type="text"
            value={loginUsername}
            onChange={(e) => {
              setLoginUsername(e.target.value);
            }}
          />

          <label>Password</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          />
          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <ChannelLanding loginUsername={loginUsername} />
      </div>
    );
  }
}

export default Login;
