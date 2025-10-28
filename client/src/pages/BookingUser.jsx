import { useEffect, useState, useContext } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { MapPin, Users, Home, Edit, Trash2, HandCoins, User, Mail, Phone, Save, X, NotebookPen, Calendar} from 'lucide-react'
import '../css/BookingUser.css'

const BookingUser = () => {
  const { backendurl, userData } = useContext(AppContent)
  const navigate = useNavigate()
  
  // Property bookings state
  const [bookedProperties, setBookedProperties] = useState([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [editingPropertyId, setEditingPropertyId] = useState(null)
  const [editPropertyForm, setEditPropertyForm] = useState({})

  // Guesthouse bookings state
  const [bookedGuesthouses, setBookedGuesthouses] = useState([])
  const [loadingGuesthouses, setLoadingGuesthouses] = useState(true)
  const [editingGuesthouseId, setEditingGuesthouseId] = useState(null)
  const [editGuesthouseForm, setEditGuesthouseForm] = useState({})

  // Active tab
  const [activeTab, setActiveTab] = useState('properties')

  useEffect(() => {
    if (!userData?.id) {
      setLoadingProperties(false)
      setLoadingGuesthouses(false)
      return
    }

    fetchBookedProperties()
    fetchBookedGuesthouses()
  }, [userData, backendurl])

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculatePropertyTotal = (price, guests) => {
    return price * guests
  }

  const calculateGuesthouseTotal = (pricePerNight, numberOfNights, numberOfGuests) => {
    return pricePerNight * numberOfNights * numberOfGuests
  }

  // ========================================
  // FETCH FUNCTIONS
  // ========================================

  const fetchBookedProperties = () => {
    setLoadingProperties(true)
    axios.get(`${backendurl}/api/booking/allBookedUser/${userData.id}`)
      .then(res => {
        if (res.data.success && res.data.bookedProperties) {
          setBookedProperties(Array.isArray(res.data.bookedProperties) ? res.data.bookedProperties : [])
        } else {
          setBookedProperties([])
        }
      })
      .catch(err => {
        console.error('Axios error:', err)
        setBookedProperties([])
        toast.error("Failed to load booked properties")
      })
      .finally(() => {
        setLoadingProperties(false)
      })
  }

  const fetchBookedGuesthouses = () => {
    setLoadingGuesthouses(true)
    axios.get(`${backendurl}/api/booking/allBookedGuesthouses/${userData.id}`)
      .then(res => {
        if (res.data.success && res.data.bookedGuesthouses) {
          setBookedGuesthouses(Array.isArray(res.data.bookedGuesthouses) ? res.data.bookedGuesthouses : [])
        } else {
          setBookedGuesthouses([])
        }
      })
      .catch(err => {
        console.error('Axios error:', err)
        setBookedGuesthouses([])
        toast.error("Failed to load booked guesthouses")
      })
      .finally(() => {
        setLoadingGuesthouses(false)
      })
  }

  // ========================================
  // PROPERTY HANDLERS
  // ========================================

  const handleEditPropertyClick = (property) => {
    setEditingPropertyId(property._id)
    setEditPropertyForm({
      fullname: property.fullname || '',
      emailadress: property.emailadress || '',
      phonenumber: property.phonenumber || '',
      Nguests: property.Nguests || 1,
      specialrequests: property.specialrequests || '',
      price: property.price || 0,
      priceUnit: property.priceUnit || '',
      totalprice: property.totalprice || 0
    })
  }

  const handleCancelPropertyEdit = () => {
    setEditingPropertyId(null)
    setEditPropertyForm({})
  }

  const handlePropertyInputChange = (field, value) => {
    setEditPropertyForm(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      // Recalculate total when guests change
      if (field === 'Nguests') {
        updated.totalprice = calculatePropertyTotal(prev.price, value)
      }
      
      return updated
    })
  }

  const handleSavePropertyEdit = async (bookingId) => {
    try {
      if (!editPropertyForm.fullname || !editPropertyForm.emailadress || !editPropertyForm.phonenumber || !editPropertyForm.Nguests) {
        toast.error('Please fill all required fields')
        return
      }

      const response = await axios.put(
        `${backendurl}/api/booking/updateBooking/${bookingId}`,
        editPropertyForm
      )

      if (response.data.success) {
        toast.success('Booking updated successfully')
        setBookedProperties(bookedProperties.map(prop => 
          prop._id === bookingId 
            ? { ...prop, ...editPropertyForm }
            : prop
        ))
        setEditingPropertyId(null)
        setEditPropertyForm({})
      } else {
        toast.error('Failed to update booking')
      }
    } catch (err) {
      console.error('Update error:', err)
      toast.error('Failed to update booking')
    }
  }

  const handleDeleteProperty = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return
    }

    try {
      const response = await axios.delete(`${backendurl}/api/booking/deleteBooking/${bookingId}`)
      if (response.data.success) {
        toast.success('Booking deleted successfully')
        setBookedProperties(bookedProperties.filter(prop => prop._id !== bookingId))
      } else {
        toast.error('Failed to delete booking')
      }
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to delete booking')
    }
  }

  // ========================================
  // GUESTHOUSE HANDLERS
  // ========================================

  const handleEditGuesthouseClick = (guesthouse) => {
    setEditingGuesthouseId(guesthouse._id)
    setEditGuesthouseForm({
      fullname: guesthouse.fullname || '',
      emailadress: guesthouse.emailadress || '',
      phonenumber: guesthouse.phonenumber || '',
      checkIn: guesthouse.checkIn ? guesthouse.checkIn.split('T')[0] : '',
      checkOut: guesthouse.checkOut ? guesthouse.checkOut.split('T')[0] : '',
      Nguests: guesthouse.Nguests || 1,
      specialrequests: guesthouse.specialrequests || '',
      pricePerNight: guesthouse.pricePerNight || 0,
      numberOfNights: guesthouse.numberOfNights || 0,
      totalprice: guesthouse.totalprice || 0
    })
  }

  const handleCancelGuesthouseEdit = () => {
    setEditingGuesthouseId(null)
    setEditGuesthouseForm({})
  }

  const handleGuesthouseInputChange = (field, value) => {
    setEditGuesthouseForm(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      // Recalculate nights when dates change
      if (field === 'checkIn' || field === 'checkOut') {
        const newCheckIn = field === 'checkIn' ? value : prev.checkIn
        const newCheckOut = field === 'checkOut' ? value : prev.checkOut
        
        // Only calculate if both dates are present and checkout is after checkin
        if (newCheckIn && newCheckOut) {
          const checkInDate = new Date(newCheckIn)
          const checkOutDate = new Date(newCheckOut)
          
          if (checkOutDate > checkInDate) {
            const nights = calculateNights(newCheckIn, newCheckOut)
            updated.numberOfNights = nights
            updated.totalprice = calculateGuesthouseTotal(prev.pricePerNight, nights, prev.Nguests)
          } else {
            // If checkout is before or equal to checkin, set nights to 0
            updated.numberOfNights = 0
            updated.totalprice = 0
            if (checkOutDate <= checkInDate) {
              toast.warning('Check-out date must be after check-in date')
            }
          }
        }
      }
      
      // Recalculate total when nights change manually
      if (field === 'numberOfNights') {
        // Also update the checkout date based on nights
        if (prev.checkIn && value > 0) {
          const checkInDate = new Date(prev.checkIn)
          const newCheckOutDate = new Date(checkInDate)
          newCheckOutDate.setDate(checkInDate.getDate() + parseInt(value))
          updated.checkOut = newCheckOutDate.toISOString().split('T')[0]
        }
        updated.totalprice = calculateGuesthouseTotal(prev.pricePerNight, value, prev.Nguests)
      }
      
      // Recalculate total when guests change
      if (field === 'Nguests') {
        updated.totalprice = calculateGuesthouseTotal(prev.pricePerNight, prev.numberOfNights, value)
      }
      
      return updated
    })
  }

  const handleSaveGuesthouseEdit = async (bookingId) => {
    try {
      if (!editGuesthouseForm.fullname || !editGuesthouseForm.emailadress || !editGuesthouseForm.phonenumber || !editGuesthouseForm.Nguests) {
        toast.error('Please fill all required fields')
        return
      }

      // Validate dates coherence
      if (editGuesthouseForm.checkIn && editGuesthouseForm.checkOut) {
        const checkInDate = new Date(editGuesthouseForm.checkIn)
        const checkOutDate = new Date(editGuesthouseForm.checkOut)
        
        if (checkOutDate <= checkInDate) {
          toast.error('Check-out date must be after check-in date')
          return
        }
        
        // Verify nights match dates
        const calculatedNights = calculateNights(editGuesthouseForm.checkIn, editGuesthouseForm.checkOut)
        if (calculatedNights !== editGuesthouseForm.numberOfNights) {
          toast.warning('Number of nights adjusted to match dates')
          editGuesthouseForm.numberOfNights = calculatedNights
          editGuesthouseForm.totalprice = calculateGuesthouseTotal(
            editGuesthouseForm.pricePerNight, 
            calculatedNights, 
            editGuesthouseForm.Nguests
          )
        }
      }

      const response = await axios.put(
        `${backendurl}/api/booking/updateGuesthouseBooking/${bookingId}`,
        editGuesthouseForm
      )

      if (response.data.success) {
        toast.success('Guesthouse booking updated successfully')
        setBookedGuesthouses(bookedGuesthouses.map(gh => 
          gh._id === bookingId 
            ? { ...gh, ...editGuesthouseForm }
            : gh
        ))
        setEditingGuesthouseId(null)
        setEditGuesthouseForm({})
      } else {
        toast.error('Failed to update guesthouse booking')
      }
    } catch (err) {
      console.error('Update error:', err)
      toast.error('Failed to update guesthouse booking')
    }
  }

  const handleDeleteGuesthouse = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this guesthouse booking?')) {
      return
    }

    try {
      const response = await axios.delete(`${backendurl}/api/booking/deleteGuesthouseBooking/${bookingId}`)
      if (response.data.success) {
        toast.success('Guesthouse booking deleted successfully')
        setBookedGuesthouses(bookedGuesthouses.filter(gh => gh._id !== bookingId))
      } else {
        toast.error('Failed to delete guesthouse booking')
      }
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to delete guesthouse booking')
    }
  }

  const loading = loadingProperties || loadingGuesthouses

  if (loading) {
    return (
      <div className="booking-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1 className="booking-title">Your Bookings</h1>
        <p className="booking-subtitle">Manage all your reservations in one place</p>
      </div>

      {/* Tabs */}
      <div className="booking-tabs">
        <button 
          className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          Properties ({bookedProperties.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'guesthouses' ? 'active' : ''}`}
          onClick={() => setActiveTab('guesthouses')}
        >
          Guesthouses ({bookedGuesthouses.length})
        </button>
      </div>

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <>
          {bookedProperties.length === 0 ? (
            <div className="empty-state">
              <Home size={64} className="empty-icon" />
              <h2>No Property Bookings Yet</h2>
              <p>You haven't booked any properties yet. Start exploring!</p>
              <button onClick={() => navigate('/')} className="btn btn-primary">
                Explore Properties
              </button>
            </div>
          ) : (
            <div className="bookings-table-container">
              <div className="table-responsive">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Property Details</th>
                      <th>Guest Information</th>
                      <th>Location</th>
                      <th>Special Requests</th>
                      <th>Guests</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookedProperties.map((property) => {
                      const isEditing = editingPropertyId === property._id
                      const displayTotal = isEditing ? editPropertyForm.totalprice : property.totalprice
                      
                      return (
                        <tr key={property._id} className={isEditing ? 'editing-row' : ''}>
                          <td>
                            <div className="property-info">
                              <Home className="table-icon" />
                              <div>
                                <div className="property-name">{property.propertyName || 'N/A'}</div>
                                <div className="property-type">{property.propertyType || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="edit-guest-info">
                                <div className="edit-input-group">
                                  <User size={14} />
                                  <input
                                    type="text"
                                    className="edit-input"
                                    value={editPropertyForm.fullname}
                                    onChange={(e) => handlePropertyInputChange('fullname', e.target.value)}
                                    placeholder="Full Name"
                                  />
                                </div>
                                <div className="edit-input-group">
                                  <Mail size={14} />
                                  <input
                                    type="email"
                                    className="edit-input"
                                    value={editPropertyForm.emailadress}
                                    onChange={(e) => handlePropertyInputChange('emailadress', e.target.value)}
                                    placeholder="Email"
                                  />
                                </div>
                                <div className="edit-input-group">
                                  <Phone size={14} />
                                  <input
                                    type="tel"
                                    className="edit-input"
                                    value={editPropertyForm.phonenumber}
                                    onChange={(e) => handlePropertyInputChange('phonenumber', e.target.value)}
                                    placeholder="Phone"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="guest-info">
                                <div className="info-row">
                                  <User size={14} />
                                  <span>{property.fullname || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                  <Mail size={14} />
                                  <span>{property.emailadress || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                  <Phone size={14} />
                                  <span>{property.phonenumber || 'N/A'}</span>
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="location-cell">
                              <MapPin size={16} className="table-icon" />
                              <span>{property.propertyLocation || 'N/A'}</span>
                            </div>
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="edit-description-group">
                                <NotebookPen size={16} className="table-icon" />
                                <textarea
                                  className="edit-textarea"
                                  value={editPropertyForm.specialrequests}
                                  onChange={(e) => handlePropertyInputChange('specialrequests', e.target.value)}
                                  placeholder="Add special requests..."
                                  rows="3"
                                />
                              </div>
                            ) : (
                              <div className="description-cell">
                                <NotebookPen size={16} className="table-icon" />
                                <span className="description-text">
                                  {property.specialrequests || 'No special requests'}
                                </span>
                              </div>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="edit-input-group">
                                <Users size={16} className="table-icon" />
                                <input
                                  type="number"
                                  className="edit-input edit-input-small"
                                  min="1"
                                  value={editPropertyForm.Nguests}
                                  onChange={(e) => handlePropertyInputChange('Nguests', parseInt(e.target.value) || 1)}
                                />
                              </div>
                            ) : (
                              <div className="guests-cell">
                                <Users size={16} className="table-icon" />
                                <span>{property.Nguests || 0}</span>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="price-cell">
                              <HandCoins size={16} className="table-icon"/>
                              <span>{property.price || 0} / {property.priceUnit}</span>
                            </div>
                          </td>
                          <td>
                            <div className={`total-price ${isEditing ? 'total-price-editing' : ''}`}>
                              {displayTotal || 0} TND
                              {isEditing && (
                                <div className="calculation-formula">
                                  {editGuesthouseForm.pricePerNight} × {editGuesthouseForm.numberOfNights} × {editGuesthouseForm.Nguests}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSavePropertyEdit(property._id)}
                                    className="btn-action btn-save"
                                    title="Save changes"
                                  >
                                    <Save size={18} />
                                  </button>
                                  <button
                                    onClick={handleCancelPropertyEdit}
                                    className="btn-action btn-cancel"
                                    title="Cancel editing"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditPropertyClick(property)}
                                    className="btn-action btn-modify"
                                    title="Modify booking"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProperty(property._id)}
                                    className="btn-action btn-delete"
                                    title="Delete booking"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bookings-summary">
                <div className="summary-card">
                  <h3>Property Booking Summary</h3>
                  <div className="summary-item">
                    <span>Total Bookings:</span>
                    <strong>{bookedProperties.length}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Total Amount:</span>
                    <strong>
                      {bookedProperties.reduce((sum, prop) => sum + (prop.totalprice || 0), 0)} TND
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Guesthouses Tab */}
      {activeTab === 'guesthouses' && (
        <>
          {bookedGuesthouses.length === 0 ? (
            <div className="empty-state">
              <Home size={64} className="empty-icon" />
              <h2>No Guesthouse Bookings Yet</h2>
              <p>You haven't booked any guesthouses yet. Start exploring!</p>
              <button onClick={() => navigate('/')} className="btn btn-primary">
                Explore Guesthouses
              </button>
            </div>
          ) : (
            <div className="bookings-table-container">
              <div className="table-responsive">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Guesthouse Details</th>
                      <th>Guest Information</th>
                      <th>Location</th>
                      <th>Check-In/Out</th>
                      <th>Special Requests</th>
                      <th>Guests</th>
                      <th>Nights</th>
                      <th>Price/Night</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookedGuesthouses.map((guesthouse) => {
                      const isEditing = editingGuesthouseId === guesthouse._id
                      const displayTotal = isEditing ? editGuesthouseForm.totalprice : guesthouse.totalprice
                      const displayNights = isEditing ? editGuesthouseForm.numberOfNights : guesthouse.numberOfNights
                      
                      return (
                        <tr key={guesthouse._id} className={isEditing ? 'editing-row' : ''}>
                          <td>
                            <div className="property-info">
                              <Home className="table-icon" />
                              <div>
                                <div className="property-name">{guesthouse.propertyName || 'N/A'}</div>
                                <div className="property-type">{guesthouse.propertyType || 'Guesthouse'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="edit-guest-info">
                                <div className="edit-input-group">
                                  <User size={14} />
                                  <input
                                    type="text"
                                    className="edit-input"
                                    value={editGuesthouseForm.fullname}
                                    onChange={(e) => handleGuesthouseInputChange('fullname', e.target.value)}
                                    placeholder="Full Name"
                                  />
                                </div>
                                <div className="edit-input-group">
                                  <Mail size={14} />
                                  <input
                                    type="email"
                                    className="edit-input"
                                    value={editGuesthouseForm.emailadress}
                                    onChange={(e) => handleGuesthouseInputChange('emailadress', e.target.value)}
                                    placeholder="Email"
                                  />
                                </div>
                                <div className="edit-input-group">
                                  <Phone size={14} />
                                  <input
                                    type="tel"
                                    className="edit-input"
                                    value={editGuesthouseForm.phonenumber}
                                    onChange={(e) => handleGuesthouseInputChange('phonenumber', e.target.value)}
                                    placeholder="Phone"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="guest-info">
                                <div className="info-row">
                                  <User size={14} />
                                  <span>{guesthouse.fullname || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                  <Mail size={14} />
                                  <span>{guesthouse.emailadress || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                  <Phone size={14} />
                                  <span>{guesthouse.phonenumber || 'N/A'}</span>
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="location-cell">
                              <MapPin size={16} className="table-icon" />
                              <span>{guesthouse.propertyLocation || 'N/A'}</span>
                            </div>
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="edit-dates-group">
                                <div className="edit-input-group">
                                  <Calendar size={14} />
                                  <input
                                    type="date"
                                    className="edit-input"
                                    value={editGuesthouseForm.checkIn}
                                    onChange={(e) => handleGuesthouseInputChange('checkIn', e.target.value)}
                                  />
                                </div>
                                <div className="edit-input-group">
                                  <Calendar size={14} />
                                  <input
                                    type="date"
                                    className="edit-input"
                                    value={editGuesthouseForm.checkOut}
                                    onChange={(e) => handleGuesthouseInputChange('checkOut', e.target.value)}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="dates-cell">
                                <div className="date-row">
                                  <Calendar size={14} />
                                  <span>{formatDate(guesthouse.checkIn)}</span>
                                </div>
                                <div className="date-row">
                                  <Calendar size={14} />
                                  <span>{formatDate(guesthouse.checkOut)}</span>
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="edit-description-group">
                                <NotebookPen size={16} className="table-icon" />
                                <textarea
                                  className="edit-textarea"
                                  value={editGuesthouseForm.specialrequests}
                                  onChange={(e) => handleGuesthouseInputChange('specialrequests', e.target.value)}
                                  placeholder="Add special requests..."
                                  rows="3"
                                />
                              </div>
                            ) : (
                              <div className="description-cell">
                                <NotebookPen size={16} className="table-icon" />
                                <span className="description-text">
                                  {guesthouse.specialrequests || 'No special requests'}
                                </span>
                              </div>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="edit-input-group">
                                <Users size={16} className="table-icon" />
                                <input
                                  type="number"
                                  className="edit-input edit-input-small"
                                  min="1"
                                  value={editGuesthouseForm.Nguests}
                                  onChange={(e) => handleGuesthouseInputChange('Nguests', parseInt(e.target.value) || 1)}
                                />
                              </div>
                            ) : (
                              <div className="guests-cell">
                                <Users size={16} className="table-icon" />
                                <span>{guesthouse.Nguests || 0}</span>
                              </div>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="edit-input-group">
                                <input
                                  type="number"
                                  className="edit-input edit-input-small"
                                  min="1"
                                  value={editGuesthouseForm.numberOfNights}
                                  onChange={(e) => handleGuesthouseInputChange('numberOfNights', parseInt(e.target.value) || 1)}
                                />
                              </div>
                            ) : (
                              <div className="nights-cell">
                                <span>{displayNights || 0}</span>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="price-cell">
                              <HandCoins size={16} className="table-icon"/>
                              <span>{guesthouse.pricePerNight || 0} TND</span>
                            </div>
                          </td>
                          <td>
                            <div className={`total-price ${isEditing ? 'total-price-editing' : ''}`}>
                              {displayTotal || 0} TND
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveGuesthouseEdit(guesthouse._id)}
                                    className="btn-action btn-save"
                                    title="Save changes"
                                  >
                                    <Save size={18} />
                                  </button>
                                  <button
                                    onClick={handleCancelGuesthouseEdit}
                                    className="btn-action btn-cancel"
                                    title="Cancel editing"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditGuesthouseClick(guesthouse)}
                                    className="btn-action btn-modify"
                                    title="Modify booking"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGuesthouse(guesthouse._id)}
                                    className="btn-action btn-delete"
                                    title="Delete booking"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bookings-summary">
                <div className="summary-card">
                  <h3>Guesthouse Booking Summary</h3>
                  <div className="summary-item">
                    <span>Total Bookings:</span>
                    <strong>{bookedGuesthouses.length}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Total Nights:</span>
                    <strong>
                      {bookedGuesthouses.reduce((sum, gh) => sum + (gh.numberOfNights || 0), 0)}
                    </strong>
                  </div>
                  <div className="summary-item">
                    <span>Total Amount:</span>
                    <strong>
                      {bookedGuesthouses.reduce((sum, gh) => sum + (gh.totalprice || 0), 0)} TND
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BookingUser