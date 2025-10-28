import { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { MapPin, Star, Users, ArrowLeft, Home as HomeIcon, Building2, Waves } from 'lucide-react'
import '../css/Booking.css'

const Booking = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { backendurl, userData } = useContext(AppContent)
  const property = location.state?.property
  
  const [imageError, setImageError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    fullname: '',
    emailadress: '',
    phonenumber: '',
    checkIn: '',
    checkOut: '',
    Nguests: 1,
    specialrequests: ''
  })

  const [errors, setErrors] = useState({})

  // If no property data, redirect back
  if (!property) {
    navigate('/')
    return null
  }

  // Calculate number of nights and total price for guesthouses
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const numberOfNights = calculateNights(formData.checkIn, formData.checkOut)
  const isGuesthouse = property.type === 'guesthouse'
  const totalPrice = isGuesthouse 
    ? property.price * numberOfNights * formData.Nguests
    : property.price * formData.Nguests

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullname || formData.fullname.trim().length < 3) {
      newErrors.fullname = 'Full name must be at least 3 characters'
    }
    if (!formData.emailadress || !/\S+@\S+\.\S+/.test(formData.emailadress)) {
      newErrors.emailadress = 'Please enter a valid email address'
    }
    if (!formData.phonenumber || formData.phonenumber.trim().length < 8) {
      newErrors.phonenumber = 'Please enter a valid phone number'
    }
    if (isGuesthouse) {
      if (!formData.checkIn) {
        newErrors.checkIn = 'Check-in date is required'
      }
      if (!formData.checkOut) {
        newErrors.checkOut = 'Check-out date is required'
      }
      if (formData.checkIn && formData.checkOut) {
        const checkInDate = new Date(formData.checkIn)
        const checkOutDate = new Date(formData.checkOut)
        if (checkOutDate <= checkInDate) {
          newErrors.checkOut = 'Check-out must be after check-in'
        }
      }
    }
    if (formData.Nguests < 1) {
      newErrors.Nguests = 'At least 1 guest is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill all required fields correctly')
      return
    }

    setIsSubmitting(true)

    try {
      const bookingData = {
        userID: userData.id,
        fullname: formData.fullname,
        emailadress: formData.emailadress,
        phonenumber: formData.phonenumber,
        Nguests: formData.Nguests,
        specialrequests: formData.specialrequests,
        OwnerId: property.OwnerId,
        propertyID: property._id,
        propertyName: property.name,
        propertyLocation: property.location,
        propertyType: property.type,
        totalprice: totalPrice
      }

      let response

      if (isGuesthouse) {
        // Guesthouse booking
        response = await axios.post(`${backendurl}/api/booking/booked_guesthouse`, {
          ...bookingData,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          pricePerNight: property.price,
          numberOfNights: numberOfNights
        })
      } else {
        // Property booking (Coucou-Beach or Residence)
        response = await axios.post(`${backendurl}/api/booking/booked_ccb_res`, {
          ...bookingData,
          price: property.price,
          priceUnit: property.priceUnit
        })
      }

      if (response.data.success) {
        toast.success('Booking confirmed successfully!')
        navigate('/BookingUser')
      } else {
        toast.error(response.data.message || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="booking-container">
      <div className="booking-wrapper">
        {/* Property Summary Card */}
        <div className="property-summary-card">
          {/* Property Image */}
          <div className="property-summary-image" data-type={property.type}>
            {property.image && !imageError ? (
              <img
                src={`${backendurl}/${property.image}`}
                alt={property.name}
                className="property-summary-img-element"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="property-summary-image-placeholder">
                {property.type === 'Coucou-Beach' && <Waves className="icon-large" strokeWidth={2} />}
                {property.type === 'guesthouse' && <HomeIcon className="icon-large" strokeWidth={2} />}
                {property.type === 'residence' && <Building2 className="icon-large" strokeWidth={2} />}
              </div>
            )}
            
            {/* Back Button */}
            <button className="back-button" onClick={() => navigate(-1)} title="Go back">
              <ArrowLeft />
            </button>
          </div>

          {/* Property Details */}
          <div className="property-summary-content">
            <h2>{property.name}</h2>
            
            
            <div className="property-summary-location">
              <MapPin className="icon-small" />
              <span>{property.location}</span>
            </div>

            <div className="property-summary-rating">
              <Star className="icon-small" style={{ color: '#eab308', fill: 'currentColor' }} />
              <span>{property.rating}</span>
              <Users className="icon-small" />
              <span className="reviews">{property.reviews} reviews</span>
            </div>

            <div className="property-summary-amenities">
              {property.amenities?.map((amenity, idx) => (
                <span key={idx} className="amenity-badge">{amenity}</span>
              ))}
            </div>

            <div className="property-summary-price">
              <span className="price">TND {property.price}</span>
              <span className="period">/ {property.priceUnit}</span>
            </div>

            {/* Booking Summary */}
            <div className="booking-summary">
              <div className="summary-row">
                <span>Price per {property.priceUnit}:</span>
                <span>TND {property.price}</span>
              </div>
              {isGuesthouse && (
                <div className="summary-row">
                  <span>Number of nights:</span>
                  <span>{numberOfNights || 0}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Number of guests:</span>
                <span>{formData.Nguests}</span>
              </div>
              <div className="summary-row total">
                <span>Total Price:</span>
                <span>TND {totalPrice || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="booking-form-card">
          <h1>Complete Your Booking</h1>
          <p className="form-subtitle">Fill in your details to confirm your reservation</p>

          <form onSubmit={handleSubmit}>
            {/* Guest Information Section */}
            <div className="form-section">
              <h3>Guest Information</h3>

              <div className="form-group">
                <label htmlFor="fullname">Full Name *</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.fullname ? 'error' : ''}
                />
                {errors.fullname && <span className="error-message">{errors.fullname}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emailadress">Email Address *</label>
                  <input
                    type="email"
                    id="emailadress"
                    name="emailadress"
                    value={formData.emailadress}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={errors.emailadress ? 'error' : ''}
                  />
                  {errors.emailadress && <span className="error-message">{errors.emailadress}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phonenumber">Phone Number *</label>
                  <input
                    type="tel"
                    id="phonenumber"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    placeholder="+216 XX XXX XXX"
                    className={errors.phonenumber ? 'error' : ''}
                  />
                  {errors.phonenumber && <span className="error-message">{errors.phonenumber}</span>}
                </div>
              </div>
            </div>

            {/* Booking Details Section */}
            <div className="form-section">
              <h3>Booking Details</h3>

              {isGuesthouse && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="checkIn">Check-In Date *</label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={errors.checkIn ? 'error' : ''}
                    />
                    {errors.checkIn && <span className="error-message">{errors.checkIn}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="checkOut">Check-Out Date *</label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      className={errors.checkOut ? 'error' : ''}
                    />
                    {errors.checkOut && <span className="error-message">{errors.checkOut}</span>}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="Nguests">Number of Guests *</label>
                <input
                  type="number"
                  id="Nguests"
                  name="Nguests"
                  value={formData.Nguests}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                  className={errors.Nguests ? 'error' : ''}
                />
                {errors.Nguests && <span className="error-message">{errors.Nguests}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="specialrequests">Special Requests (Optional)</label>
                <textarea
                  id="specialrequests"
                  name="specialrequests"
                  value={formData.specialrequests}
                  onChange={handleChange}
                  placeholder="Any special requests or requirements..."
                  rows="4"
                />
                <small>Let us know if you have any special requirements</small>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Booking