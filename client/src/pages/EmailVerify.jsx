import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import '../css/EmailVerify.css'
import { MailCheck } from 'lucide-react'
const EmailVerify = () => {
  axios.defaults.withCredentials = true 
  const {backendurl, isloggedin, userData, getUserData} = useContext(AppContent)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')
      
      const {data} = await axios.post(backendurl + '/api/auth/verify-account', {otp})
      
      if (data.success){
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
        // Add error animation to inputs
        inputRefs.current.forEach(input => {
          input.classList.add('error')
          setTimeout(() => input.classList.remove('error'), 400)
        })
      }
    } catch (error) {
      toast.error(error.message)
      
      // Add error animation to inputs
      inputRefs.current.forEach(input => {
        input.classList.add('error')
        setTimeout(() => input.classList.remove('error'), 400)
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    isloggedin && userData && userData.isAccountverified && navigate('/')
  }, [isloggedin, userData])

  return (
    <div className="email-verify-container">
      <form className="email-verify-form" onSubmit={onSubmitHandler}>
       
        <div className="email-icon">
          <MailCheck />
        </div>

        <h1>Email Verify Code</h1>
        <p>Enter the 6-digit code sent to your email</p>
        
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
        
        <button 
          type="submit" 
          className={`verify-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {!isLoading && 'Verify Email'}
        </button>
      </form>
    </div>
  )
}

export default EmailVerify