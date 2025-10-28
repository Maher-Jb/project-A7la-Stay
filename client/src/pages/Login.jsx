import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/login.css'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import {toast} from 'react-toastify'

const Login = () => {


  const navigate = useNavigate()

  const {backendurl, setIsLoggedin, getUserData} = useContext(AppContent)
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('')
  const [passwordStrength, setPasswordStrength] = useState('') // New state for password strength
  
  const togglePassword = () => {
    setShowPassword(!showPassword)
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

  const onSubmitHandler = async(e) => {
    try {
      
      e.preventDefault()
      axios.defaults.withCredentials = true
      if (state==='Sign Up'){
        const {data} = await axios.post(backendurl+'/api/auth/register',{name,email,password,role})

        if (data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)

        }

      }else{
        const {data}= await axios.post(backendurl+'/api/auth/login',{email,password})

        if (data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)

        }
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong")
    }
    
    
  }

  return (
    <div className="login-container" >
      

      <div className="right-section">
        <div className="login-form">
          <div className="form-header">
            <h2>{state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}</h2>
            <p>{state === 'Sign Up' ? 'Join us today and get started' : 'Please sign in to your account'}</p>
          </div>

          <form onSubmit={onSubmitHandler}>
            {state === 'Sign Up' && (
              <>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  onChange={e => setName(e.target.value)} 
                  value={name} 
                  type="text" 
                  placeholder="Enter your full name" 
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select onChange={e => setRole(e.target.value)} value={role} >
                  <option value="">-- Select a role --</option>
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              </>
            )}
            
            <div className="form-group">
              <label>Email Address</label>
              <input 
                onChange={e => setEmail(e.target.value)} 
                value={email} 
                type="email" 
                placeholder="Enter your email" 
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-container">
                <input 
                  onChange={e => {
                    setPassword(e.target.value)
                    setPasswordStrength(checkPasswordStrength(e.target.value)) // Check strength on change
                  }}
                  value={password} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={togglePassword}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {/* Password strength indicator */}
              {password && state === "Sign Up" &&(
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
              {state === 'Login' && (
                <p className="forgot-password" onClick={() => navigate('/reset-password')}>
                  Forgot password?
                </p>
              )}
            </div>
            <button type="submit" className="sign-in-btn">
              {state}
            </button>
          </form>

          {state === 'Sign Up' ? (
            <p className="create-account">
              Already have an account?{' '}
              <span onClick={() => setState('Login')}>Login here</span>
            </p>
          ) : (
            <p className="create-account">
              Don't have an account?{' '}
              <span onClick={() => setState('Sign Up')}>Sign Up</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login