import React, { useState } from 'react';
import '../styles/register.css';

const Register = ({ setAuth }) => {
  const [input, setInput] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = input;

  const updateInp = (e) => {
    setInput({...input, [e.target.name]: e.target.value});
  }

  const submitRegister = async(e) => {
    e.preventDefault();

    try {
        const body = { name, email, password };

        const response = await fetch("/auth/register", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if(response.status === 401) {
          alert('User with that email already exists');
          return;
        }

        const parseRes = await response.json();
        
        //have to save jwt token to local storage
        localStorage.setItem('token', parseRes.token);
        setAuth(true);
    } catch (error) {
      console.log('hnnnnn');
        console.error(error.message);
    }
}

  return (
    <div className="wrapper">
        <div className="auroral-northern"></div>
        <div className="auroral-stars"></div>
        <div id="reg-wrap">
          <form id="reg-form" onSubmit={submitRegister}>
              <input type="name" name="name" placeholder="name" onChange={updateInp}></input>
              <input type="email" name="email" placeholder="email" onChange={updateInp}></input>
              <input type="password" name="password" placeholder="password" onChange={updateInp}></input>
              <button>Submit</button>
          </form>
        </div>
    </div>
  );
}

export default Register;