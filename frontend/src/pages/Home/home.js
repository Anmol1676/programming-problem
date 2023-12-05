import React from "react";
import './home.css';
import img1 from '../Home/cartoon.png';
function Home(){
    return(
        <section className="landing-page">
            <div className="container">
                <h1 className="title">
                    Welcome to Programming Problem
                </h1>
                <h2 className="subtitle">
                    A channel-based social media site for your programming questions.
                </h2>
                <div className="hero-image">
                <img src={img1} alt="How to calculate holiday pay" />
            </div>
            </div>
        </section>
    );
}

export default Home;
