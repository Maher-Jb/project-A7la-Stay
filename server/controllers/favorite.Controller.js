import Favorite from "../models/Favoris.js"

export const toggleFavorite = async (req, res) => {
  try {
    const { userId,
  propertyID,
  type,
  name,
  location,
  price,
  priceUnit,
  rating,
  reviews,
  amenities,
  image} = req.body
    if (!userId|| !propertyID) {
      return res.status(400).json({ success: false, message: "Missing data" })
    }

    const existing = await Favorite.findOne({ userId, propertyID })
    if (existing) {
      await existing.deleteOne()
      return res.json({ success: true, message: "Removed from favorites" })
    } else {
      await Favorite.create({ userId, propertyID,type,name,location,price,priceUnit,rating,reviews,amenities,image })
      return res.json({ success: true, message: "Added to favorites" })
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params
    const favorites = await Favorite.find({ userId })
    res.json({ success: true, favorites })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
