import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// CSS
import "./newReservation.css";

// Routes
import ErrorAlert from "../layout/ErrorAlert";
import NewReservationHeader from "./NewReservationHeader";

// Functions
import { createReservation } from "../utils/api";
import { today } from "../utils/date-time";
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const NewReservation = () => {
  // setStates
  const [reservation, setReservation] = useState({});
  const [errors, setErrors] = useState(null);

  const history = useHistory();

  // inserts information from form as typed to reservation state
  function changeHandler({ target: { name, value } }) {
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: value,
    }));
  }

  // submits reservation state to the createReservation function then sends user to dashboard date of
  async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const valid = withinRestraints(splitTime);
    if (valid) {
      await createReservation(reservation, abortController.signal);
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

  validTime(reservation.reservation_time);

  // Error handler
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
console.log(reservation.reservation_date)
  return (
    <>
      <NewReservationHeader />
      <ErrorAlert error={errors} />

      <div className="formStyle">
        <form onSubmit={submitHandler}>
          <label htmlFor="name">Name</label>

          <div className="row">
            <div className="col">
              <input
                id="firstName"
                type="text"
                name="first_name"
                placeholder="First Name"
                value={reservation.first_name}
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
                placeholder="Last Name"
                value={reservation.last_name}
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
            placeholder="555-555-5555"
            value={reservation.mobile_number}
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
                value={reservation.reservation_date}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="col">
              <input
                type="time"
                id="appt"
                name="reservation_time"
                value={reservation.reservation_time}
                onChange={changeHandler}
                placeholder="10:30am"
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
                placeholder="Party Size"
                min="1"
                value={reservation.people}
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
                Cancel
              </button>
              <button className="btn btn-info m-1" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewReservation;
