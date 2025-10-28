import BookedGuesthouse from '../models/BookedGuesthouse.js'

// Book a guesthouse
const bookGuesthouse = async (req, res) => {
  try {
    const {
      userID,
      fullname,
      emailadress,
      phonenumber,
      checkIn,
      checkOut,
      Nguests,
      specialrequests,
      OwnerId,
      propertyID,
      propertyName,
      propertyLocation,
      propertyType,
      pricePerNight,
      totalprice,
      numberOfNights
    } = req.body

    // Validate required fields
    if (!userID || !fullname || !emailadress || !phonenumber || !checkIn || !checkOut || !Nguests) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide all necessary information.",
      })
    }

    // Validate dates
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date.",
      })
    }

    const newGuesthouseBooking = new BookedGuesthouse({
      userID,
      fullname,
      emailadress,
      phonenumber,
      checkIn,
      checkOut,
      Nguests,
      specialrequests,
      OwnerId,
      propertyID,
      propertyName,
      propertyLocation,
      propertyType,
      pricePerNight,
      totalprice,
      numberOfNights
    })

    await newGuesthouseBooking.save()

    res.status(201).json({
      success: true,
      message: "Guesthouse booked successfully!",
      data: newGuesthouseBooking,
    })
  } catch (error) {
    console.error('Guesthouse booking error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to book guesthouse",
    })
  }
}

// Update a guesthouse booking
const updateGuesthouseBooking = async (req, res) => {
  try {
    const { id } = req.params
    const {
      fullname,
      emailadress,
      phonenumber,
      checkIn,
      checkOut,
      Nguests,
      specialrequests,
      numberOfNights,
      totalprice
    } = req.body

    // Validate required fields
    if (!fullname || !emailadress || !phonenumber || !Nguests) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide all necessary information.",
      })
    }

    // Validate dates if provided
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      
      if (checkOutDate <= checkInDate) {
        return res.status(400).json({
          success: false,
          message: "Check-out date must be after check-in date.",
        })
      }
    }

    // Find and update the booking
    const updatedBooking = await BookedGuesthouse.findByIdAndUpdate(
      id,
      {
        fullname,
        emailadress,
        phonenumber,
        checkIn,
        checkOut,
        Nguests,
        specialrequests,
        numberOfNights,
        totalprice
      },
      { new: true, runValidators: true }
    )

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Guesthouse booking not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Guesthouse booking updated successfully!",
      data: updatedBooking,
    })
  } catch (error) {
    console.error('Update guesthouse booking error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update guesthouse booking",
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

// Get all guesthouse bookings for a specific user
const getAllGuesthouseBookingsByUser = async (req, res) => {
  try {
    const { userID } = req.params

    const bookings = await BookedGuesthouse.find({ userID: userID })
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

export { bookGuesthouse, updateGuesthouseBooking, deleteGuesthouseBooking, getAllGuesthouseBookingsByUser }