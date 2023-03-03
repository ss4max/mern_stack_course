const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const roomSchema = new mongoose.Schema(
    {
        roomName: {
            type: String,
            required: true
        },
        datesOccupied: [{
            type: Date,
            required: false
        }],
        vacant: {
            type: Boolean,
            default: true
        }
    }
)

module.exports = mongoose.model('Room', roomSchema)