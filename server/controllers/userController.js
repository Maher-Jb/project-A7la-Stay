import userModel from "../models/User.js"
import { checkPasswordStrength, getPasswordStrengthMessage } from '../utils/passwordValidator.js'
import bcrypt from "bcryptjs"

const Userdata = async (req,res)=>{
    try {
       const { userId } = req.user
        const user= await userModel.findById(userId)
        if (!user){
           return  res.json({success: false, message: "user not found"})
        }
        res.json({
            success:true,
            userData:{
                id: user._id,
                name: user.name,
                email: user.email,
                isAccountverified: user.isAccountverified,
                role: user.role
            }
        })
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}

const deleteaccount = async (req, res) => {
  try {
    const { id } = req.params

    const deletedaccount = await userModel.findByIdAndDelete(id)

    if (!deletedaccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      })
    }
    
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      path: '/'
    })


    res.status(200).json({
      success: true,
      message: "Your account deleted successfully!",
      data: deletedaccount,
    })
  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete account",
    })
  }
}

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, password } = req.body

    // Build update object with only provided fields
    const updateData = {}

    // Validate and add name ONLY if provided and not empty
    if (name && name.trim() !== '') {
      updateData.name = name.trim()
    }

    // Validate and add email ONLY if provided and not empty
    if (email && email.trim() !== '') {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        })
      }
      updateData.email = email.trim()
    }

    // Validate and add password ONLY if provided and not empty
    if (password !== undefined && password.trim() !== '') {
      // Check password strength
      const passwordCheck = checkPasswordStrength(password)
      
      // Reject weak and medium passwords - only allow strong passwords
      if (!passwordCheck.isValid) {
        return res.json({ 
          success: false, 
          message: getPasswordStrengthMessage(passwordCheck.level)
        })
      }
      
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }

    // If no fields to update, return error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update. Please provide at least one field to change.",
      })
    }

    // Find and update the account
    const updatedAccount = await userModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!updatedAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Account updated successfully!",
      data: {
        id: updatedAccount._id,
        name: updatedAccount.name,
        email: updatedAccount.email,
        role: updatedAccount.role
      },
    })
  } catch (error) {
    console.error('Update Account error:', error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update Account",
    })
  }
}

export { Userdata, deleteaccount, updateAccount }