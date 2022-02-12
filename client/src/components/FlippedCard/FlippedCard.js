import React from "react";
import "./FlippedCard.css";

const FlippedCard = ({ card }) => {
  return (
    <div>
      <div className="main-container">
        <div className="the-card">
          <div className="the-front">
            <h1>{card.title}</h1>
            <p>{card.question}</p>
          </div>
          <div className="the-back">
            <p>{card.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippedCard;
