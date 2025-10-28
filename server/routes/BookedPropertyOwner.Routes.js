import express from 'express'
import {getAllBookedProperty, deleteBookedProperty, deleteGuesthouseBooking, getAllGuesthouseBookings} from '../controllers/BookedPropertyOwner.controller.js'

const PropertyOwnerRouter = express.Router()

// Property bookings routes
PropertyOwnerRouter.get('/allBookedProperties/:OwnerId', getAllBookedProperty)
PropertyOwnerRouter.delete('/deleteBookedProperty/:id', deleteBookedProperty)  

// Guesthouse bookings routes
PropertyOwnerRouter.get('/allBookedGuesthouses/:OwnerId', getAllGuesthouseBookings)
PropertyOwnerRouter.delete('/deleteGuesthouseBooking/:id', deleteGuesthouseBooking)

export default PropertyOwnerRouter