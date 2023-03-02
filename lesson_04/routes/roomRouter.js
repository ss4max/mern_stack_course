const express = require('express')
const router = express.Router()
const reservationsController = require('../controllers/reservationsController')

router.route('/')
    .get(reservationsController.getAllRooms)
    .post(reservationsController.createNewRoom)
    .patch(reservationsController.updateRoom)
    .delete(reservationsController.deleteRoom)

module.exports = router