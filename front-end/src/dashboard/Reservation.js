import React from "react";
import { useHistory } from "react-router-dom";
import "./Dashboard.css";

import { cancelReservation } from "../utils/api";

const Reservation = ({ reservation }) => {
  const history = useHistory();

  async function cancelHandler(reservation) {
    const abortController = new AbortController();
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      reservation.status = "cancelled";
      await cancelReservation(reservation, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
      return () => abortController.abort();
    }
  }
  return (
    <>
      <div className="res">
        <table>
          <tbody>{reservation.people} people for</tbody>
          <tbody>
            <em>
              {reservation.first_name} {reservation.last_name}
            </em>
          </tbody>
          <tbody>at {reservation.reservation_time}</tbody>
          <tbody> Contact number: {reservation.mobile_number} </tbody>
          <tbody data-reservation-id-status={reservation.reservation_id}>
            Status: {reservation.status}
          </tbody>
          {reservation.status === "booked" && (
            <>
              <button
                className="m-1 btn btn-danger btn-sm"
                onClick={() => cancelHandler(reservation)}
                data-reservation-id-cancel={reservation.reservation_id}
              >
                Cancel
              </button>
              <a
                className="m-1 btn btn-info btn-sm"
                href={`/reservations/${reservation.reservation_id}/seat`}
              >
                Seat
              </a>
              <button
                className="m-1 btn btn-secondary btn-sm"
                href={`reservations/${reservation.reservation_id}/edit`}
              >
                Edit
              </button>
            </>
          )}
        </table>
      </div>
    </>
  );
};

export default Reservation;
