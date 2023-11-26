import React, { useState } from "react";
//import ChannelLanding from '../ChannelLanding/chanelLanding'
import Axios from 'axios';


function Registration(){
    const [regUsername, SetRegUsername] = useState(""); 
    const [regPassword, SetRegPassword] = useState("");
    const [RegUsernameTaken, SetRegUsernameTaken] = useState(false); 

    const register = () => {
        Axios.post('http://localhost:4000/regitration', { // Corrected URL and syntax
            username: regUsername,
            password: regPassword
        }).then((response) => {
            console.log(response);
            if (response.data === "Username already taken") {
                window.alert("Username is Taken"); 
                SetRegUsernameTaken(true);
            } else {
                window.alert("Registration was successful!!! ;) ");
            }
        }).catch((error) => {
            console.log(error);
            window.alert("Registration failed!");
        });
    };


    return (
        <div className="App">
            <div className="registration">
                <h1>Registration</h1>
                <label>Username</label>
                <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => {
                        SetRegUsername(e.target.value);
                        SetRegUsernameTaken(false); // reset RegUsernameTaken state
                    }}
                />
                {RegUsernameTaken && <p>Username already taken</p>} {/* Use RegUsernameTaken here */}

                <label>Password</label>
                <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => SetRegPassword(e.target.value)}
                />
                <button onClick={register}>Register</button>
            </div> 
        </div>
    );
}

export default Registration;