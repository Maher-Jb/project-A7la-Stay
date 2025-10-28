import bookccb_res from '../models/Bookccb.res.js'
import BookedGuesthouse from '../models/BookedGuesthouse.js'

 const getAllBookedProperty = async (req, res) => {
  try {
    const { OwnerId } = req.params
    const bookedProperties = await bookccb_res.find({ OwnerId })
    res.json({ success: true, bookedProperties })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

 const deleteBookedProperty = async (req, res) => {
  try {
    const { id } = req.params
    const deletedBooking = await bookccb_res.findByIdAndDelete(id)
    
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }
    
    res.json({ success: true, message: "Booking deleted successfully" })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}



const getAllGuesthouseBookings = async (req, res) => {
  try {
    const { OwnerId } = req.params

    const bookings = await BookedGuesthouse.find({OwnerId})
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      bookedGuesthouses: bookings,
    })
  } catch (error) {
    console.error('Fetch guesthouse bookings error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch guesthouse bookings",
    })
  }
}

// Delete a guesthouse booking
const deleteGuesthouseBooking = async (req, res) => {
  try {
    const { id } = req.params

    const deletedBooking = await BookedGuesthouse.findByIdAndDelete(id)

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: "Guesthouse booking not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Guesthouse booking deleted successfully!",
      data: deletedBooking,
    })
  } catch (error) {
    console.error('Delete guesthouse booking error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete guesthouse booking",
    })
  }
}

export { getAllBookedProperty, deleteBookedProperty, deleteGuesthouseBooking, getAllGuesthouseBookings }