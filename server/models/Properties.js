import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  OwnerId: {
    type : String,
    required : true
  },
  type: {
    type: String,
    enum: ['Coucou-Beach', 'guesthouse', 'residence'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  priceUnit: {
    type: String,
    enum: ['Day', 'Night', 'Month'],
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  amenities: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    
    default: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  }
}, { timestamps: true });

const Properties = mongoose.model('propertie', propertySchema);

export default Properties
