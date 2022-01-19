import React from "react";
import { useParams } from "react-router-dom";

// CSS
import "../dashboard/Dashboard.css";

// Returns stylized title header for website
const NewReservationHeader = () => {
  const reservationId = useParams().reservationId
  return (
    <h1 className="title">
      <div className="row">
        <img
          src="https://www.seekpng.com/png/full/486-4863621_fork-and-knife-png-21-buy-clip-art.png"
          alt="Logo"
        />
        {reservationId ? (
          <div className="col">Edit a Reservation</div>
        ) : (
          <div className="col">Create a Reservation</div>
        )}
      </div>
    </h1>
  );
};

export default NewReservationHeader;
