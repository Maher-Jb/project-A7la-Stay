import express from 'express'
import {bookGuesthouse, updateGuesthouseBooking, deleteGuesthouseBooking, getAllGuesthouseBookingsByUser } from '../controllers/bookGuesthouse.Controller.js'

const guesthouseRouter = express.Router()

guesthouseRouter.post('/booked_guesthouse', bookGuesthouse)
guesthouseRouter.put('/updateGuesthouseBooking/:id', updateGuesthouseBooking)  
guesthouseRouter.delete('/deleteGuesthouseBooking/:id', deleteGuesthouseBooking)  
guesthouseRouter.get('/allBookedGuesthouses/:userID', getAllGuesthouseBookingsByUser) 

export default guesthouseRouter