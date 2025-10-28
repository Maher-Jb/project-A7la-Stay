import mongoose from "mongoose"

const BookedGuesthouseSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  emailadress: {
    type: String,
    required: true
  },
  phonenumber: {
    type: Number,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  Nguests: {
    type: Number,
    required: true,
    min: 1
  },
  specialrequests: {
    type: String,
    default: ''
  },
  OwnerId: {
    type : String,
    required: true
  },
  propertyID: {
    type: String,
    required: true
  },
  propertyName: {
    type: String,
    required: true
  },
  propertyLocation: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    default: 'guesthouse'
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  totalprice: {
    type: Number,
    required: true
  },
  numberOfNights: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})



const BookedGuesthouse = mongoose.model('BookedGuesthouse', BookedGuesthouseSchema)

export default BookedGuesthouse