import React, { useState } from "react";
import Axios from 'axios';
import ChannelLanding from '../ChannelLanding/chanelLanding';
import { useNavigate } from 'react-router-dom';

function Login({onLogin}){
  const navigate = useNavigate();
    const [loginUsername, SetLoginUsername] = useState("");
    const [loginPassword, SetLoginPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => {
        Axios.post('http://localhost:4000/login',{
            username: loginUsername,
            password: loginPassword
        }).then((respond)=>{
            console.log(respond);
            if(respond.data === "Login successful"){
                window.alert("Login successful!!!! :D");
                onLogin(true);
                navigate('/Channel');
            }else{
                window.alert("Login Failed")
            }

        }).catch((error) => {
          // It's also a good practice to handle network or server errors
          console.error("Error during login", error);
          window.alert("Login Failed - Error occurred");
      });
    }
    const loginSuccess = () => {
        // After successful login
        onLogin(true);
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
                    SetLoginUsername(e.target.value);
                }}
              />
      
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => {
                    SetLoginPassword(e.target.value);
                }}
              />
              <button onClick={login}>Login</button>

              
            </div>
      
          </div>
        );
      } else {
        return (
          <div className="App">
            <ChannelLanding loginUsername={loginUsername}/>

            
        </div>
    
        );
      }
    }

export default Login;