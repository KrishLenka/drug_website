import React from "react";

const TextInput = ({ label, type = "text", ...props }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <input
      type={type}
      className="input-field"
      {...props}
    />
  </div>
);

export default TextInput;