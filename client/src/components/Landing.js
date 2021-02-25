import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auroral.css';
import '../styles/landing.css';

const Landing = () => {

  return (
      <div class="wrapper">
        <div class="auroral-northern"></div>
        <div class="auroral-stars"></div>
        <div id="title">TODO LIST</div>
        <div id="link-wrap">
          <Link id="register" to="/register">Register</Link>
          <Link id="login" to="/login">Log in</Link>
        </div>
      </div>
  );
}

export default Landing;