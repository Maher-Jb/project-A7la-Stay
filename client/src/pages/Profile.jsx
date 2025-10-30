import { useState, useContext } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { User, Mail, Lock, Save, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import '../css/Profile.css'

const Profile = () => {
  const { userData, backendurl, setUserData, setIsLoggedin } = useContext(AppContent)
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: ''
  })

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    level: '',
    message: ''
  })

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Check password strength on password field change
    if (field === 'password') {
      checkPasswordStrength(value)
    }
  }

  // Password strength checker (frontend preview)
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ level: '', message: '' })
      return
    }

    let strength = 0
    
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

    if (strength === 0 || strength <= 2) {
      setPasswordStrength({
        level: 'weak',
        message: 'Password is too weak. Use 8+ characters, uppercase, lowercase, numbers, and special characters.'
      })
    } else if (strength <= 3) {
      setPasswordStrength({
        level: 'medium',
        message: 'Password is medium. Add more complexity for better security.'
      })
    } else {
      setPasswordStrength({
        level: 'strong',
        message: 'Password is strong!'
      })
    }
  }

  // Handle update account
  const handleUpdateAccount = async (e) => {
    e.preventDefault()

    // Build update payload with ONLY fields that have been changed and are non-empty
    const updateData = {}
    
    // Check if name changed and is not empty
    if (formData.name.trim() !== '' && formData.name !== userData?.name) {
      updateData.name = formData.name.trim()
    }
    
    // Check if email changed and is not empty
    if (formData.email.trim() !== '' && formData.email !== userData?.email) {
      updateData.email = formData.email.trim()
    }
    
    // Check if password is provided (always counts as change since we don't show current password)
    if (formData.password.trim() !== '') {
      // Validate password strength before adding to update
      if (passwordStrength.level !== 'strong') {
        toast.error('Please use a strong password')
        return
      }
      updateData.password = formData.password.trim()
    }

    // If nothing to update, show message
    if (Object.keys(updateData).length === 0) {
      toast.info('No changes detected')
      return
    }

    setLoading(true)

    try {
      const response = await axios.put(
        `${backendurl}/api/user/${userData.id}`,
        updateData  // Only send fields that changed
      )

      if (response.data.success) {
        toast.success('Account updated successfully!')
        
        // Update userData in context with the new values
        const updatedUserData = { ...userData }
        
        if (updateData.name) {
          updatedUserData.name = updateData.name
        }
        
        if (updateData.email) {
          updatedUserData.email = updateData.email
        }
        
        setUserData(updatedUserData)
        
        setIsEditing(false)
        // Reset form to current user data
        setFormData({
          name: updatedUserData.name,
          email: updatedUserData.email,
          password: ''
        })
        setPasswordStrength({ level: '', message: '' })
      } else {
        toast.error(response.data.message || 'Failed to update account')
      }
    } catch (err) {
      console.error('Update error:', err)
      toast.error(err.response?.data?.message || 'Failed to update account')
    } finally {
      setLoading(false)
    }
  }

  // Handle delete account
  const handleDeleteAccount = async () => {
    setLoading(true)

    try {
      const response = await axios.delete(`${backendurl}/api/user/${userData.id}`)

      if (response.data.success) {
        toast.success('Account deleted successfully')
        
        // Clear user data and logout
        setUserData(null)
        setIsLoggedin(false)
        
        // Redirect to home
        navigate('/')
      } else {
        toast.error('Failed to delete account')
      }
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to delete account')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setFormData({
      name: userData?.name || '',
      email: userData?.email || '',
      password: ''
    })
    setPasswordStrength({ level: '', message: '' })
    setIsEditing(false)
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <AlertTriangle size={48} />
          <h2>Not Logged In</h2>
          <p>Please log in to view your profile</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Manage your account settings</p>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Account Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleUpdateAccount} className="profile-form">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">
                <User size={18} />
                Full Name {isEditing && <span className="optional-label">(Optional)</span>}
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                placeholder={isEditing ? "Leave empty to keep current name" : "Enter your full name"}
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={18} />
                Email Address {isEditing && <span className="optional-label">(Optional)</span>}
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                placeholder={isEditing ? "Leave empty to keep current email" : "Enter your email"}
              />
            </div>

            {/* Password Field - Only shown when editing */}
            {isEditing && (
              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} />
                  New Password <span className="optional-label">(Optional)</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Leave empty to keep current password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className={`password-strength ${passwordStrength.level}`}>
                    <div className="strength-bar">
                      <div className={`strength-fill ${passwordStrength.level}`}></div>
                    </div>
                    <p className="strength-message">{passwordStrength.message}</p>
                  </div>
                )}
              </div>
            )}

            {/* Role Display (Read-only) */}
            <div className="form-group">
              <label>Account Type</label>
              <div className="role-badge">
                {userData.role === 'owner' ? 'Owner' : userData.role === 'user' ? 'User' : 'Admin'}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-small"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Danger Zone */}
        <div className="danger-zone">
          <div className="danger-zone-header">
            <AlertTriangle size={24} />
            <h3>Danger Zone</h3>
          </div>
          <p className="danger-zone-description">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger"
            >
              <Trash2 size={18} />
              Delete Account
            </button>
          ) : (
            <div className="delete-confirm">
              <p className="confirm-message">
                Are you absolutely sure? This action cannot be undone.
              </p>
              <div className="confirm-actions">
                <button
                  onClick={handleDeleteAccount}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-small"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Yes, Delete My Account
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile