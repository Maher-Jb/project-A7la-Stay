import mongoose from "mongoose"

const BookccbresSchema = new mongoose.Schema({
    userID : {
        type : String
    },
    fullname: {
    type: String, required: true
  },
    emailadress: {
    type: String, required: true 
  },
    phonenumber: {
    type: Number, required: true
  },
    specialrequests: {
    type: String
  },
    Nguests: {
    type: Number, required: true
  },
    OwnerId: {
    type : String,
    required: true
  },
    propertyID: {
    type : String,
    required: true
  },
    propertyName: {
    type : String
  },
    propertyLocation: {
    type: String
  },
    propertyType : {
    type: String
  },
    price : {
    type : Number
  },
  priceUnit: {
    type : String
  },
    totalprice : {
    type : Number
  },
    bookingDate: {
    type: Date,
    default: Date.now
  }
})

  const bookccb_res = mongoose.model('bookccbre', BookccbresSchema);
  
  export default bookccb_res