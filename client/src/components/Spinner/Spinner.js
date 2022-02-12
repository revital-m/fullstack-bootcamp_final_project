import React from "react";
import "./Spinner.css";

function Spinner({ spinnerClass, loadingClass }) {
  return (
    <div className={`spinner ${spinnerClass}`}>
      {/* <p className={`loading loading--${loadingClass}`}>Loading...</p> */}
    </div>
  );
}

export default Spinner;
