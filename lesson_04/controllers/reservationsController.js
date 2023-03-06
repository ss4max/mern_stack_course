const Reservation = require('../models/Reservation')
const asyncHandler = require('express-async-handler')
const Room = require('../models/Room')
const bcrypt = require('bcrypt')

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function hasDate(dates, date) {

    const found = dates.find(dateFound => {
        console.log(dateFound.getTime() + " " + date.getTime())
        return dateFound.getTime() === date.getTime()
    }
    )

    return found
}

function deleteDates(dates, deleteTheseDates) {

    let filteredDates = dates

    deleteTheseDates.forEach(deleteThisDate => {
        filteredDates = filteredDates.filter(date => date !== deleteThisDate)
    });

    return filteredDates
}

// @desc Get all reservations
// @route GET /reservations
// @access Private
const getAllReservations = asyncHandler(async (req, res) => {
    // Get all reservations from MongoDB
    const reservations = await Reservation.find().lean()

    // If no reservations 
    if (!reservations?.length) {
        return res.status(400).json({ message: 'No reservations found' })
    }

    res.json(reservations)
})

// @desc Create new reservation
// @route POST /reservation
// @access Private
const createNewReservation = asyncHandler(async (req, res) => {
    const { name, adults, children, checkInDate, nights, room, note } = req.body

    // Confirm data
    if (!name || !adults || !checkInDate || !nights || !room) {
        return res.status(400).json({ message: 'Name, adults, check in date, nights, and room name required.' })
    }

    let checkedInDates = [];
    for (let i = 0; i <= nights; i++) {
        checkedInDates.push(addDays(checkInDate, i))
    }

    const checkOutDate = checkedInDates.pop();
    const roomModel = await Room.findOne({ roomName: room }).exec();

    if (!roomModel) {
        return res.status(400).json({ message: 'Room not found' })
    }

    if (roomModel.datesOccupied.length > 0) {
        checkedInDates.forEach(date => {
            if (hasDate(roomModel.datesOccupied, date)) {
                return res.status(409).json({ message: 'Double booked room' })
            }
        })
    }

    roomModel.datesOccupied.push(...checkedInDates)

    const updatedRoom = await roomModel.save()

    const reservationObject = { name, adults, children, checkInDate, checkOutDate, checkedInDates, nights, room, note }

    // Create and store new reservation 
    const reservation = await Reservation.create(reservationObject)

    if (reservation && updatedRoom) { //created 
        res.status(201).json({ message: `New reservation for ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid reservation data received' })
    }
})

// @desc Update a reservation
// @route PATCH /reservations
// @access Private
const updateReservation = asyncHandler(async (req, res) => {
    const { id, name, adults, children, checkInDate, nights, room, note } = req.body

    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'ID is required' })
    }

    // Does the reservation exist to update?
    const reservation = await Reservation.findById(id).exec()

    if (!reservation) {
        return res.status(400).json({ message: 'Reservation not found' })
    }

    let currentCheckedInDates = [];

    for (let i = 0; i <= reservation.nights; i++) {
        currentCheckedInDates.push(addDays(reservation.checkInDate, i))
    }

    //Remove check out date
    currentCheckedInDates.pop();

    const roomModel = await Room.findOne({ roomName: room }).exec();

    if (!roomModel) {
        return res.status(400).json({ message: 'Room not found' })
    }

    //remove original dates
    roomModel.datesOccupied = deleteDates(roomModel.datesOccupied, currentCheckedInDates)

    console.log(roomModel.datesOccupied)

    //new check in dates
    let checkedInDates = [];
    for (let i = 0; i <= nights; i++) {
        checkedInDates.push(addDays(checkInDate, i))
    }

    //new check out date
    const checkOutDate = checkedInDates.pop();

    if (roomModel.datesOccupied.length > 0) {
        checkedInDates.forEach(date => {

            if (hasDate(roomModel.datesOccupied, date)) {
                return res.status(409).json({ message: 'Double booked room' })
            }
        })
    }

    roomModel.datesOccupied.push(...checkedInDates)

    const updatedRoom = await roomModel.save()

    reservation.name = name
    reservation.adults = adults
    reservation.children = children
    reservation.checkIn = checkInDate
    reservation.checkOutDate = checkOutDate
    reservation.nights = nights
    reservation.room = room
    reservation.note = note

    const updatedReservation = await reservation.save()

    if (updatedReservation && updatedRoom) { //created 
        res.json({ message: `${updatedReservation.name} updated` })
    }
})

// @desc Delete a reservation
// @route DELETE /reservations
// @access Private
const deleteReservation = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Reservation ID Required' })
    }

    // Does the user exist to delete?
    const reservation = await Reservation.findById(id).exec()

    if (!reservation) {
        return res.status(400).json({ message: 'Reservation not found' })
    }

    const result = await reservation.deleteOne()

    const reply = `Reservation with ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllReservations,
    createNewReservation,
    updateReservation,
    deleteReservation
}