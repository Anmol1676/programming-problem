import './App.css';

import Nav from './pages/Nav/nav';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Registration from './pages/Registration/registration';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Nav />
          {/* this will route us to the page */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            {/*<Route path="/" element={< />} /> */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
