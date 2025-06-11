import React from "react";
import Logo from "../components/Logo";
import TextInput from "../components/TextInput";
import LoginButton from "../components/LoginButton";
import LoginCard from "../components/LoginCard";
import "./LoginPage.css";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="login-bg">
      <LoginCard>
        <Logo />
        <form>
          <TextInput label="Username" placeholder="Enter your username" />
          <TextInput label="Password" type="password" placeholder="Enter your password" />
          <LoginButton>Log In</LoginButton>
        </form>
        <div className="login-links">
          <Link to="/forgot-password" className="login-link">
            Forgot password?
          </Link>
          <Link to="/register" className="login-link">
            Create account
          </Link>
        </div>
      </LoginCard>
    </div>
  );
};

export default LoginPage; 