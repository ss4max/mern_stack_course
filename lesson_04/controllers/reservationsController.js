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

    const found = dates.find(dateFound =>
        dateFound.getTime() === date.getTime())

    return found
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
    const { name, adults, children, checkInDate, nights, room, note, active } = req.body

    // Confirm data
    if (!name || !adults || !checkInDate || !nights || !room) {
        return res.status(400).json({ message: 'Name, adults, check in date, nights, and room name required.' })
    }

    // Check for double booking
    // const doubleBooked = await Reservation.findOne({ room }).lean().exec()

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

    const reservationObject = { name, adults, children, checkInDate, checkOutDate, checkedInDates, nights, room, note, active }

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
    const { id, name, adults, children, checkIn, nights, room, note, active } = req.body

    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'ID is required' })
    }

    // Does the user exist to update?
    const reservation = await Reservation.findById(id).exec()

    if (!reservation) {
        return res.status(400).json({ message: 'Reservation not found' })
    }

    // // Check for duplicate 
    // const duplicate = await Reservation.findOne({ username }).lean().exec()

    // // Allow updates to the original user 
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate username' })
    // }

    const checkInDate = new Date(checkIn + "T014:00:00")

    reservation.name = name
    reservation.adults = adults
    reservation.children = children
    reservation.checkIn = checkInDate
    reservation.nights = nights
    reservation.room = room
    reservation.note = note
    reservation.active = active

    // if (password) {
    //     // Hash password 
    //     user.password = await bcrypt.hash(password, 10) // salt rounds 
    // }

    const updatedReservation = await reservation.save()

    res.json({ message: `${updatedReservation.name} updated` })
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