import React, { useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/EmailVerify.css'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { RotateCcwKey ,Key ,MailCheck} from 'lucide-react'

const ResetPassword = () => {

  const {backendurl} = useContext(AppContent)
  axios.defaults.withCredentials = true
  
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('') // New state for password strength
  

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  // New function to check password strength
  const checkPasswordStrength = (pwd) => {
    let strength = 0
    
    // Check password length
    if (pwd.length >= 8) strength++
    if (pwd.length >= 12) strength++
    
    // Check for lowercase and uppercase
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
    
    // Check for numbers
    if (/\d/.test(pwd)) strength++
    
    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++
    
    // Set strength level
    if (strength === 0) return ''
    if (strength <= 2) return 'weak'
    if (strength <= 3) return 'medium'
    return 'strong'
  }

  const onSubmitEmail = async (e)=>{
    e.preventDefault()
    try {
      const {data} = await axios.post(backendurl + '/api/auth/send-reset-otp',{email})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async (e)=>{
    e.preventDefault()
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmited (true)
  }

  const onSubmitNewPassword = async (e) =>{
    e.preventDefault()
    try {
      const {data} = await axios.post(backendurl + '/api/auth/reset-password', {email, otp , newPassword})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="email-verify-container">
      {!isEmailSent &&
   <form className="email-verify-form" onSubmit={onSubmitEmail}>
    <RotateCcwKey />
<h1>Reset Password</h1>
        <p>Enter your registered email address</p>
        <div className="otp-input-container">
        <input type="email" placeholder='Email address' value={email} onChange={e => setEmail(e.target.value)} required/>
        </div>
        <button className="verify-button">Submit</button>
   </form>
   }
{!isOtpSubmited && isEmailSent && 
  <form className="email-verify-form" onSubmit={onSubmitOTP}>
        {/* Optional: Add email icon */}
        <div className="email-icon">
          <MailCheck />
        </div>
        <div>

        <h1>Reset Password Code</h1>
        <p>Enter the 6-digit code sent to your email</p>
        </div>
        <div className="otp-input-container" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="otp-input"
              ref={(el) => (inputRefs.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              required
            />
          ))}
        </div>
        
        <button type="submit" className="verify-button">
          Submit
        </button>
      </form>
      }

      {isOtpSubmited && isEmailSent && 
      <form className="email-verify-form" onSubmit={onSubmitNewPassword}>
       <Key /> 
<h1>New Password</h1>
        <p>Enter your the password below </p>
        <div className="otp-input-container">
        <input  
          type="password" 
          placeholder='Your New Password' 
          value={newPassword} 
          onChange={e => {
            setNewPassword(e.target.value)
            setPasswordStrength(checkPasswordStrength(e.target.value)) // Check strength on change
          }} 
          required
        />
        </div>
        {/* Password strength indicator */}
        {newPassword && (
          <div className="password-strength">
            <div className={`strength-bar ${passwordStrength}`}>
              <div className="strength-fill"></div>
            </div>
            <span className="strength-text">
              {passwordStrength === 'weak' && 'Weak password'}
              {passwordStrength === 'medium' && 'Medium password'}
              {passwordStrength === 'strong' && 'Strong password'}
            </span>
          </div>
        )}
        <button className="verify-button">Submit</button>
   </form>
   }
    </div>
  )
}

export default ResetPassword