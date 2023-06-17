import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { context } from "../Context//Provider";
import { useNavigate } from "react-router-dom";
import { loginValidation } from "../../validation/loginValidation";
export default function Login() {
  const { state, dispatch } = useContext(context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { success, user, error } = loginValidation(email, password);

    if (success) {
      setError("");
      dispatch({ type: "LOGIN", payload: user });
      localStorage.setItem("token", user.token);
      navigate("/");
      console.log("Login successful");
    } else {
      setError(error);
    }
  };

  // useEffect(() => {
  //   console.log(state.user);
  // }, [state.user]);

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="card-title">Log In Here</h2>
        <form className="form-data" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 10 characters required"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
