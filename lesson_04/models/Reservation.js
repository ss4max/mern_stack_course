const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        adults: {
            type: Number,
            required: true
        },
        children: {
            type: Number,
            default: 0
        },
        checkInDate: {
            type: Date,
            required: true
        },
        checkOutDate: {
            type: Date,
            required: false
        },
        nights: {
            type: Number,
            required: true
        },
        room: {
            type: String,
            required: true,
        },
        note: {
            type: String,
            default: 'None'
        }
    }
)

module.exports = mongoose.model('Reservation', reservationSchema)