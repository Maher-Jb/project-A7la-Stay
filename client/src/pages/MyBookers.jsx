import { useEffect, useState, useContext } from 'react'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { MapPin, Users, Home, Trash2, HandCoins, User, Mail, Phone, NotebookPen, Calendar } from 'lucide-react'
import '../css/BookingUser.css' // Reusing the same CSS

const MyBookers = () => {
  const { backendurl, userData } = useContext(AppContent)
  
  // Property bookings state
  const [bookedProperties, setBookedProperties] = useState([])
  const [loadingProperties, setLoadingProperties] = useState(true)

  // Guesthouse bookings state
  const [bookedGuesthouses, setBookedGuesthouses] = useState([])
  const [loadingGuesthouses, setLoadingGuesthouses] = useState(true)

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

  // ========================================
  // FETCH FUNCTIONS
  // ========================================

  const fetchBookedProperties = () => {
    setLoadingProperties(true)
    axios.get(`${backendurl}/api/BookedPropertyOwner/allBookedProperties/${userData.id}`)
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
        toast.error("Failed to load property bookings")
      })
      .finally(() => {
        setLoadingProperties(false)
      })
  }

  const fetchBookedGuesthouses = () => {
    setLoadingGuesthouses(true)
    axios.get(`${backendurl}/api/BookedPropertyOwner/allBookedGuesthouses/${userData.id}`)
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
        toast.error("Failed to load guesthouse bookings")
      })
      .finally(() => {
        setLoadingGuesthouses(false)
      })
  }

  // ========================================
  // DELETE HANDLERS
  // ========================================

  const handleDeleteProperty = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return
    }

    try {
      const response = await axios.delete(`${backendurl}/api/BookedPropertyOwner/deleteBookedProperty/${bookingId}`)
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

  const handleDeleteGuesthouse = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this guesthouse booking?')) {
      return
    }

    try {
      const response = await axios.delete(`${backendurl}/api/BookedPropertyOwner/deleteGuesthouseBooking/${bookingId}`)
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
          <p>Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1 className="booking-title">My Bookers</h1>
        <p className="booking-subtitle">View and manage all bookings for your properties</p>
      </div>

      {/* Tabs */}
      <div className="booking-tabs">
        <button 
          className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          Property Bookings ({bookedProperties.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'guesthouses' ? 'active' : ''}`}
          onClick={() => setActiveTab('guesthouses')}
        >
          Guesthouse Bookings ({bookedGuesthouses.length})
        </button>
      </div>

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <>
          {bookedProperties.length === 0 ? (
            <div className="empty-state">
              <Home size={64} className="empty-icon" />
              <h2>No Property Bookings</h2>
              <p>You don't have any property bookings yet.</p>
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
                    {bookedProperties.map((property) => (
                      <tr key={property._id}>
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
                        </td>
                        <td>
                          <div className="location-cell">
                            <MapPin size={16} className="table-icon" />
                            <span>{property.propertyLocation || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="description-cell">
                            <NotebookPen size={16} className="table-icon" />
                            <span className="description-text">
                              {property.specialrequests || 'No special requests'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="guests-cell">
                            <Users size={16} className="table-icon" />
                            <span>{property.Nguests || 1}</span>
                          </div>
                        </td>
                        <td>
                          <div className="price-cell">
                            <HandCoins size={16} className="table-icon"/>
                            <span>{property.price || 0} / {property.priceUnit}</span>
                          </div>
                        </td>
                        <td>
                          <div className="total-price">
                            {property.totalprice || 0} TND
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleDeleteProperty(property._id)}
                              className="btn-action btn-delete"
                              title="Delete booking"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
              <h2>No Guesthouse Bookings</h2>
              <p>You don't have any guesthouse bookings yet.</p>
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
                    {bookedGuesthouses.map((guesthouse) => (
                      <tr key={guesthouse._id}>
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
                        </td>
                        <td>
                          <div className="location-cell">
                            <MapPin size={16} className="table-icon" />
                            <span>{guesthouse.propertyLocation || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
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
                        </td>
                        <td>
                          <div className="description-cell">
                            <NotebookPen size={16} className="table-icon" />
                            <span className="description-text">
                              {guesthouse.specialrequests || 'No special requests'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="guests-cell">
                            <Users size={16} className="table-icon" />
                            <span>{guesthouse.Nguests || 1}</span>
                          </div>
                        </td>
                        <td>
                          <div className="nights-cell">
                            <span>{guesthouse.numberOfNights || 0}</span>
                          </div>
                        </td>
                        <td>
                          <div className="price-cell">
                            <HandCoins size={16} className="table-icon"/>
                            <span>{guesthouse.pricePerNight || 0} TND</span>
                          </div>
                        </td>
                        <td>
                          <div className="total-price">
                            {guesthouse.totalprice || 0} TND
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleDeleteGuesthouse(guesthouse._id)}
                              className="btn-action btn-delete"
                              title="Delete booking"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default MyBookers