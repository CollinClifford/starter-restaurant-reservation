// service
const service = require("./reservations.service");

// error handlers
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasOnlyValidProperties = require("../errors/reservationsErrors/hasOnlyValidProperties");
const hasProperties = require("../errors/reservationsErrors/hasProperties");
const hasValidDate = require("../errors/reservationsErrors/validDate");
const hasValidTime = require("../errors/reservationsErrors/validTime");
const reservationExists = require("../errors/reservationsErrors/reservationExists");
const peopleInteger = require("../errors/reservationsErrors/peopleInteger");
const statusIsBooked = require("../errors/reservationsErrors/statusIsBooked");
const statusUnknown = require("../errors/reservationsErrors/statusUnknown");
const statusIsFinished = require("../errors/reservationsErrors/statusIsFinished");
const statusReport = require("../errors/reservationsErrors/statusReport");

// makes sure reservations object has the following required properties
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
  // "status" // This seems to throw off a test.
);

// lists based on mobile_number or date
async function list(req, res) {
  if (req.query.mobile_number) {
    return res.json({
      data: await service.readPhoneNumber(req.query.mobile_number),
    });
  }
  if (req.query.date) {
    return res.json({ data: await service.list(req.query.date) });
  }
}

// lists reservation found by reservation_id
async function read(req, res, next) {
  const { reservation: data } = res.locals;
  res.status(200).json({ data });
}

// creates a new reservation
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

// updates reservation status
async function updateStatus(req, res, next) {
  const resId = req.params.reservationId;
  const status = req.body.data.status;
  const data = await service.updateStatus(resId, status);
  res.status(200).json({ data });
}

// async function update(req, res, next) {
//   const updatedReservation = req.body.data;
//   const data = await service.update(updatedReservation);
//   res.status(200).json({ data });
// }

async function update(req, res) {
  const { reservation_id } = res.locals.reservation;

  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties, // makes sure that the properties listed match those that are in the DB
    hasRequiredProperties, // makes sure that it has ALL properties
    peopleInteger, // makes sure people is a number
    hasValidDate, // makes sure that date is not before today or on a Tuesday
    hasValidTime, // makes sure the date is before current time and within business hours
    statusReport, // determines what status the reservation is
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists), // makes sure reservation exists and sends it to locals
    asyncErrorBoundary(read),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists), // makes sure reservation exists and sends it to locals
    statusUnknown, // 400 if status is unknown
    statusIsFinished, // 400 if status is already finished
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidDate,
    hasValidTime,
    peopleInteger,
    asyncErrorBoundary(update),
  ],
};
