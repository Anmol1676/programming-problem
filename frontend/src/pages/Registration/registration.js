import React, { useState } from "react";
//import ChannelLanding from '../ChannelLanding/chanelLanding'
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './reg.css';


function Registration(){
    const [regUsername, SetRegUsername] = useState(""); 
    const [regPassword, SetRegPassword] = useState("");
    const [RegUsernameTaken, SetRegUsernameTaken] = useState(false); 
    const [classification, setClassification] = useState('beginner');

    const navigate = useNavigate();

    const register = () => {
        Axios.post('http://localhost:4000/registration', {
            username: regUsername,
            password: regPassword,
            classification: classification
        }).then((response) => {
            console.log(response);
            if (response.data === "Username already taken") {
                window.alert("Username is Taken"); 
                SetRegUsernameTaken(true);
            } else {
                window.alert("Registration was successful!!! ;) ");
                navigate('/login');
            }
        }).catch((error) => {
            console.log(error);
            window.alert("Registration failed!");
        });
    };


    return (
        <div className="registration-App">
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
                <label>Classification</label>
                    <select 
                        value={classification} 
                         onChange={(e) => setClassification(e.target.value)}
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                    </select>
                <button onClick={register}>Register</button>
            </div> 
        </div>
    );
}

export default Registration;