import express from 'express'
import {bookedproperty, getAllBookedProperty, deleteBookedProperty, updateBookedProperty} from '../controllers/bookccb_res.Controller.js'


const bookedpropertyRouter = express.Router()
bookedpropertyRouter.post('/booked_ccb_res',bookedproperty)
bookedpropertyRouter.get('/allBookedUser/:userID',getAllBookedProperty)
bookedpropertyRouter.delete('/deleteBooking/:userID', deleteBookedProperty)
bookedpropertyRouter.put('/updateBooking/:userID', updateBookedProperty)
export default bookedpropertyRouter