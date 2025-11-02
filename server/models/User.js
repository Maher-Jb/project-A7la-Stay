
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },               
  email: { type: String, required: true, unique: true}, 
  password: { type: String, required: true },           
  role: { type: String, enum: ['admin','owner','user'], default: 'user' }, 
  verifyOtp:{type: String, default:''},
  verifyOtpExpireAt: {type: Number, default: 0},
  isAccountverified : {type: Boolean, default:false},
  resetOtp : {type: String, default : ''},
  resetOtpExpiredAt : {type: Number, default : 0},

}, { timestamps: true })
const userModel = mongoose.models.user || mongoose.model('user',userSchema)
export default userModel
// module.exports = mongoose.model('User', userSchema);     // export model
