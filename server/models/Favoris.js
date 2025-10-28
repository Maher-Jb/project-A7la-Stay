import mongoose from 'mongoose'

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  propertyID: { type: String, required: true },
  type: { type: String},
  name: { type: String, trim: true },
  location: { type: String, trim: true },
  price: { type: Number },
  priceUnit: { type: String },
  rating: { type: Number },
  reviews: { type: Number },
  amenities: { type: [String] },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },

})

export default mongoose.model("Favorite", favoriteSchema)