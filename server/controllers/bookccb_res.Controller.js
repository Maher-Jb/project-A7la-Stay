import bookccb_res from '../models/Bookccb.res.js'

export const bookedproperty = async (req, res) => {
  try {
    const {
      userID,
      fullname,
      emailadress,
      phonenumber,
      specialrequests,
      Nguests,
      OwnerId,
      propertyID,
      propertyName,
      propertyLocation,
      propertyType,
      price,
      priceUnit,
      totalprice
    } = req.body;

 
    if (!fullname || !emailadress || !phonenumber || !Nguests) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

  
    const newPropertyBooked = new bookccb_res({
      userID,
      fullname,
      emailadress,
      phonenumber,
      specialrequests,
      Nguests,
      OwnerId,
      propertyID,
      propertyName,
      propertyLocation,
      propertyType,
      price,
      priceUnit,
      totalprice
    });

    await newPropertyBooked.save();

    res.status(201).json({
      success: true,
      message: "Property booked successfully",
      data: newPropertyBooked,
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllBookedProperty = async (req, res) => {
  try {
    const { userID } = req.params
    const bookedProperties = await bookccb_res.find({ userID })
    res.json({ success: true, bookedProperties })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const deleteBookedProperty = async (req, res) => {
  try {
    const { userID } = req.params
    const deletedBooking = await bookccb_res.findByIdAndDelete(userID)
    
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }
    
    res.json({ success: true, message: "Booking deleted successfully" })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}





export const updateBookedProperty = async (req, res) => {
  try {
    const { userID } = req.params
    const { fullname, emailadress, phonenumber, Nguests, specialrequests , totalprice} = req.body

   
    if (!fullname || !emailadress || !phonenumber || !Nguests) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      })
    }

    const updatedBooking = await bookccb_res.findByIdAndUpdate(
      userID,
      {
        fullname,
        emailadress,
        phonenumber,
        Nguests,
        specialrequests,
        totalprice
      },
      { new: true } 
    )

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      })
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}










