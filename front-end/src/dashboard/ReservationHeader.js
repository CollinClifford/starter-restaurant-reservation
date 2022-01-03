import React from "react";

// CSS
import "./Dashboard.css";

// Returns stylized title header for website
const ReservationHeader = () => {
  return (
    <h1 className="title">
      <div className="row">
       
          <img
            src="https://www.seekpng.com/png/full/486-4863621_fork-and-knife-png-21-buy-clip-art.png"
            alt="Logo"
          />
      
        <div className="col">Reservations</div>
      </div>
    </h1>
  );
};

export default ReservationHeader;
