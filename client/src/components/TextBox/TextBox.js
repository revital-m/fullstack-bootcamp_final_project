import React from "react";
import "./TextBox.css";

const TextBox = ({ textBoxClass, textBoxTxt }) => {
  return (
    <div className={`box ${textBoxClass}`}>
      <h1>{textBoxTxt}</h1>
    </div>
  );
};

export default TextBox;
