import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css';

const Login = ({ setAuth }) => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });

    const { email, password } = input;

    const updateInp = (e) => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    const submitLogin = async(e) => {
        e.preventDefault();

        try {
            const body = { email, password };

            const response = await fetch("/api/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if(response.status === 401) {
                alert("Incorrect username or password");
                return;
            }
            
            const parseRes = await response.json();
            //have to save jwt token to local storage
            localStorage.setItem('token', parseRes.token);
            setAuth(true);
        } catch (error) {

            
            console.error(error.message);
        }
    }

  return (
    <div className="wrapper">
        <div className="auroral-northern"></div>
        <div className="auroral-stars"></div>
        <div id="form-wrap">
            <form id="form" onSubmit={submitLogin}>
                <input type="email" name="email" placeholder="email" onChange={updateInp}></input>
                <input type="password" name="password" placeholder="password" onChange={updateInp}></input>
                <div id="link-wrap">
                    <button>Login</button>
                    <Link to="/register">Register</Link>
                </div>
            </form>
        </div>

        
    </div>
  );
}

export default Login;