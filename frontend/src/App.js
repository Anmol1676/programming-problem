import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './pages/Nav/nav';
import NavBar from './pages/NavBar/navBar';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Registration from './pages/Registration/registration';
import Channel from './pages/ChannelLanding/chanelLanding';
import Posts from './pages/Post/post';
import Search from './pages/Search/search';
import Users from './pages/Users/users';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // This function is triggered when the user logs in
  const handleLogin = (status, user) => {
    setIsLoggedIn(status);
    setUsername(user); 
    console.log("Logged in user:", user); 
};
const onLogout = () => {
  setIsLoggedIn(false);
  setUsername('');
};

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {isLoggedIn ? <NavBar onLogout={onLogout} username= {username}/> : <Nav />} 
          {/* Conditional rendering of navigation based on login status */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/registration" element={<Registration />} />

            {isLoggedIn && <Route path="/channel" element={<Channel loginUsername={username} />} />}
            <Route path="/channel/:channelId/posts" element={<Posts />} />

   


            {isLoggedIn && <Route path="/search" element={<Search />} />}
            {isLoggedIn && <Route path="/Users" element={<Users />} />}


            {/* Add other routes as needed */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
