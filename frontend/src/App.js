import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './pages/Nav/nav';
import NavBar from './NavBar/navBar';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Registration from './pages/Registration/registration';
import Channel from './pages/ChannelLanding/chanelLanding';
import Posts from './pages/Post/post';
import Comment from './pages/Commit/Comment';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };


  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {isLoggedIn ? <NavBar /> : <Nav />} {/* Conditional rendering */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/registration" element={<Registration />} />
            {isLoggedIn && <Route path="/channel" element={<Channel />} />}
            {isLoggedIn && <Route path="/channel/:channelId/posts" element={<Posts />} />}
           

          

            {/* Add other routes as needed */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
