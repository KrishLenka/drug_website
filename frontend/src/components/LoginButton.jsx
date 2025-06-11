import React from "react";

const LoginButton = ({ children, ...props }) => (
  <button className="login-button" {...props}>
    {children}
  </button>
);

export default LoginButton;