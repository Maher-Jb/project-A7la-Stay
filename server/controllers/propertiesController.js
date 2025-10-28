import Properties from "../models/Properties.js"

const getpropertiesData = async (req, res) => {
  try {
    const allProperties = await Properties.find()
    res.json({ success: true, message: "All properties", properties: allProperties })
  } catch (error) {
    console.error("Error fetching properties:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

const AddProperty = async (req, res) => {
  try {
    const {
      OwnerId, type, name, location,phone,price, priceUnit, amenities
    } = req.body

    // ✅ CHANGED: Normalize the path to use forward slashes for URL compatibility
    const image = req.file ? req.file.path.replace(/\\/g, '/') : null

    if (!OwnerId || !type || !name || !location || !price || !priceUnit || !amenities || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide all necessary information.",
      })
    }

    const newProperty = new Properties({
      OwnerId,
      type,
      name,
      location,
      phone,
      price,
      priceUnit,
      amenities: JSON.parse(amenities),
      image
    })

    await newProperty.save()

    res.status(201).json({
      success: true,
      message: "Property added successfully!",
      data: newProperty,
    })
  } catch (error) {
    console.error('Property adding error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add property",
    })
  }
}


const getpropertiesByOwner =async (req, res)=>{
try {
    const { OwnerId } = req.params

    const OwnerProperties = await Properties.find({ OwnerId: OwnerId })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      OwnerProperties: OwnerProperties,
    })
  } catch (error) {
    console.error('Fetch Owner Properties error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch Owner Properties",
    })
  }

}

const deleteproperty = async (req, res) => {
  try {
    const { id } = req.params

    const deletedproperty = await Properties.findByIdAndDelete(id)

    if (!deletedproperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Your property deleted successfully!",
      data: deletedproperty,
    })
  } catch (error) {
    console.error('Delete property error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete property",
    })
  }
}


const updateOwnerProperty = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      location,
      phone,
      price,
      amenities
      
    } = req.body

    // Validate required fields
    if (!name || !location || !phone || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide all necessary information.",
      })
    }

    // Find and update the booking
    const updatedOwnerProperty = await Properties.findByIdAndUpdate(
      id,
      {
      name,
      location,
      phone,
      price,
      amenities
      },
      { new: true, runValidators: true }
    )

    if (!updatedOwnerProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully!",
      data: updatedOwnerProperty,
    })
  } catch (error) {
    console.error('Update Property error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update Property",
    })
  }
}

export { getpropertiesData, AddProperty ,getpropertiesByOwner, deleteproperty, updateOwnerProperty }