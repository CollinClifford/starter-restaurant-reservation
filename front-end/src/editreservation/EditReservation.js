import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

// Routes
import ErrorAlert from "../layout/ErrorAlert";
import EditReservationHeader from "./EditReservationHeader";

// Functions
import { readReservation, updateReservation } from "../utils/api";
import { today } from "../utils/date-time";
const dayjs = require("dayjs");

const EditReservation = () => {
  // setStates
  const [errors, setErrors] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [updatedReservation, setUpdatedReservation] = useState([]);

  const reservationId = useParams().reservationId;

  const history = useHistory();

  // updates updatedReservation state with user input
  function changeHandler({ target: { name, value } }) {
    setUpdatedReservation((previousReservation) => ({
      ...previousReservation,
      reservation_id: Number(reservation.reservation_id),
      created_at: reservation.created_at,
      updated_at: new Date(),
      [name]: value,
    }));
  }

  // loads reservation from API
  useEffect(() => {
    function loadDashboard() {
      const abortController = new AbortController();
      setErrors(null);
      readReservation(reservationId, abortController.signal)
        .then(setReservation)
        .catch(setErrors);
      return () => abortController.abort();
    }
    loadDashboard();
  }, [reservationId]);

  // send updatedReservation to API
  async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const valid = withinRestraints(splitTime);
    if (valid) {
      await updateReservation(updatedReservation, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
      return () => abortController.abort();
    }
  }

  // formats reservation_date
  const resDate = dayjs(reservation.reservation_date).format("dddd");

  // formats current time
  const currentTime = dayjs()
  .utc()
  .local()
  .format("HH:mm")
  .toString()
  .split(":")
  .join("");

  // formats inputted time
  let splitTime;
  function validTime(time) {
    if (time) {
      splitTime = Number(time.toString().split(":").join(""));
      return splitTime;
    }
  }

  validTime(updatedReservation.reservation_time);

  // makes sure updated reservation matches criteria
  function withinRestraints(time) {
    const errorArray = [];
    if (time > 2130) {
      errorArray.push("Reservations only available before 9:30pm.");
    } else if (time <= 1029) {
      errorArray.push("Reservations only available after 10:30am.");
    } else if (
      splitTime <= currentTime &&
      reservation.reservation_date === today()
    ) {
      errorArray.push("Reservations must be set after current time.");
    } else if (reservation.reservation_date < today()) {
      errorArray.push("Reservations only available for future dates.");
    } else if (resDate === "Tuesday") {
      errorArray.push("Sorry, we are closed on Tuesdays.");
    }
    if (errorArray.length) {
      setErrors(new Error(errorArray.toString()));
      return false;
    }
    return true;
  }

  return (
    <>
      <EditReservationHeader />
      <ErrorAlert error={errors} />
      <div className="row formStyle">
        <form onSubmit={() => submitHandler}>
          <label htmlFor="name">Name</label>

          <div className="row">
            <div className="col">
              <input
                id="firstName"
                type="text"
                name="first_name"
                placeholder={reservation.first_name}
                value={updatedReservation.first_name}
                onChange={changeHandler}
                className="form-control"
                required
              />
            </div>
            <div className="col">
              <input
                id="lastName"
                type="text"
                name="last_name"
                placeholder={reservation.last_name}
                value={updatedReservation.last_name}
                onChange={changeHandler}
                className="form-control"
                required
              />
            </div>
          </div>
          <label htmlFor="phone">Mobile Number</label>

          <input
            id="phone"
            type="tel"
            name="mobile_number"
            placeholder={reservation.mobile_number}
            value={updatedReservation.mobile_number}
            onChange={changeHandler}
            className="form-control"
            autoCorrect="tel-local"
            required
          />

          <div className="row">
            <div className="col">
              <label htmlFor="date">Reservation Date</label>
            </div>
            <div className="col">
              <label htmlFor="time">Time</label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <input
                type="date"
                id="date"
                name="reservation_date"
                placeholder={reservation.reservation_date}
                value={updatedReservation.reservation_date}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="col">
              <input
                type="time"
                id="appt"
                name="reservation_time"
                value={updatedReservation.reservation_time}
                onChange={changeHandler}
                placeholder={reservation.reservation_time}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="party">Party Size</label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <input
                id="partSize"
                type="number"
                name="people"
                placeholder={reservation.people}
                min="1"
                value={updatedReservation.people}
                onChange={changeHandler}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col m-3">
              <button
                className="btn btn-secondary m-1"
                onClick={() => history.goBack()}
              >
                cancel
              </button>
              <button className="btn btn-info m-1" type="submit">
                submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditReservation;
