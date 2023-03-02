const Room = require('../models/Room')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all rooms 
// @route GET /rooms
// @access Private
const getAllRooms = asyncHandler(async (req, res) => {
    // Get all rooms from MongoDB
    const rooms = await Room.find().lean()

    // If no rooms 
    if (!rooms?.length) {
        return res.status(400).json({ message: 'No rooms found' })
    }

    // Add username to each room before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const roomsWithUser = await Promise.all(rooms.map(async (room) => {
        const user = await User.findById(room.user).lean().exec()
        return { ...room, username: user.username }
    }))

    res.json(roomsWithUser)
})

// @desc Create new room
// @route POST /rooms
// @access Private
const createNewRoom = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Room.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate room title' })
    }

    // Create and store the new user 
    const room = await Room.create({ user, title, text })

    if (room) { // Created 
        return res.status(201).json({ message: 'New room created' })
    } else {
        return res.status(400).json({ message: 'Invalid room data received' })
    }

})

// @desc Update a room
// @route PATCH /rooms
// @access Private
const updateRoom = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm room exists to update
    const room = await Room.findById(id).exec()

    if (!room) {
        return res.status(400).json({ message: 'Room not found' })
    }

    // Check for duplicate title
    const duplicate = await Room.findOne({ title }).lean().exec()

    // Allow renaming of the original room 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate room title' })
    }

    room.user = user
    room.title = title
    room.text = text
    room.completed = completed

    const updatedRoom = await room.save()

    res.json(`'${updatedRoom.title}' updated`)
})

// @desc Delete a room
// @route DELETE /rooms
// @access Private
const deleteRoom = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Room ID required' })
    }

    // Confirm room exists to delete 
    const room = await Room.findById(id).exec()

    if (!room) {
        return res.status(400).json({ message: 'Room not found' })
    }

    const result = await room.deleteOne()

    const reply = `Room '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllRooms,
    createNewRoom,
    updateRoom,
    deleteRoom
}