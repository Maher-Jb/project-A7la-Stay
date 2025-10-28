import { useState, useContext, useEffect } from 'react'
import { AppContent } from '../context/AppContext'
import { Home,HousePlus,HouseHeart, MapPinHouse, DollarSign, Star, Image, X, Save, RotateCcw, Phone, SquarePen, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import '../css/Myproperties.css'

const Myproperties = () => {
  const { backendurl, userData,fetchProperties,properties,loading } = useContext(AppContent)

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    location: '',
    phone: '',
    price: '',
    priceUnit: '',
    amenities: [],
    image: null,
    preview: null
  })

  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
 

  const dynamicOptions = [
    { id: 1, label: "Terrace", value: "terrace" },
    { id: 2, label: "Sea Access", value: "sea_access" },
    { id: 3, label: "Wifi", value: "wifi" },
    { id: 4, label: "Shared Kitchen", value: "shared_kitchen" },
    { id: 5, label: "Study Room", value: "study_room" },
    { id: 6, label: "Laundry", value: "laundry" },
    { id: 7, label: "Security", value: "security" },
    { id: 8, label: "Cafeteria", value: "cafeteria" },
    { id: 9, label: "Study Lounge", value: "study_lounge" },
    { id: 10, label: "Parking", value: "parking" },
    { id: 11, label: "Gym", value: "gym" },
    { id: 12, label: "Library Access", value: "library_access" },
  ]

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties()
  }, [])

  

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => {
      let newData = { ...prev, [name]: value }

      if (name === "type") {
        if (value === "Coucou-Beach") {
          newData.priceUnit = "Day"
        } else if (value === "guesthouse") {
          newData.priceUnit = "Night"
        } else if (value === "residence") {
          newData.priceUnit = "Month"
        } else {
          newData.priceUnit = ""
        }
      }

      return newData
    })

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAmenitiesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value)
    setFormData(prev => ({ ...prev, amenities: selected }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file')
        return
      }

      setFormData(prev => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file)
      }))
    }
  }

  const handleRemoveImage = () => {
    if (formData.preview) {
      URL.revokeObjectURL(formData.preview)
    }
    setFormData(prev => ({
      ...prev,
      image: null,
      preview: null
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!isEditing && !formData.type) {
      newErrors.type = 'Property type is required'
    }
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Property name must be at least 3 characters'
    }
    if (!formData.location || formData.location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters'
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }
    if (!formData.phone || formData.phone.length < 8) {
      newErrors.phone = 'Please enter a valid phone'
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
      if (isEditing) {
        // Update existing property
        const updateData = {
          name: formData.name,
          location: formData.location,
          phone: formData.phone,
          price: formData.price,
          amenities: formData.amenities
        }

        const response = await axios.put(
          `${backendurl}/api/data-properties/${editingId}`,
          updateData
        )

        if (response.data.success) {
          toast.success('Property updated successfully!')
          handleReset()
          fetchProperties()
        } else {
          toast.error(response.data.message || 'Failed to update property')
        }
      } else {
        // Add new property
        const formDataToSend = new FormData()
        formDataToSend.append('OwnerId', userData.id)
        formDataToSend.append('type', formData.type)
        formDataToSend.append('name', formData.name)
        formDataToSend.append('location', formData.location)
        formDataToSend.append('phone', formData.phone)
        formDataToSend.append('price', formData.price)
        formDataToSend.append('priceUnit', formData.priceUnit)
        formDataToSend.append('amenities', JSON.stringify(formData.amenities))
        if (formData.image) {
          formDataToSend.append('image', formData.image)
        }

        const response = await axios.post(
          `${backendurl}/api/data-properties/AddProperty`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        if (response.data.success) {
          toast.success('Property added successfully!')
          handleReset()
          fetchProperties()
        } else {
          toast.error(response.data.message || 'Failed to add property')
        }
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error.response?.data?.message || 'Failed to process property')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (property) => {
    setIsEditing(true)
    setEditingId(property._id)
    setFormData({
      type: property.type,
      name: property.name,
      location: property.location,
      phone: property.phone,
      price: property.price,
      priceUnit: property.priceUnit,
      amenities: property.amenities || [],
      image: null,
      preview: property.image ? `${backendurl}/${property.image}` : null
    })
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return
    }

    try {
      const response = await axios.delete(`${backendurl}/api/data-properties/${id}`)

      if (response.data.success) {
        toast.success('Property deleted successfully!')
        fetchProperties()
      } else {
        toast.error(response.data.message || 'Failed to delete property')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete property')
    }
  }

  const handleReset = () => {
    if (formData.preview && !isEditing) {
      URL.revokeObjectURL(formData.preview)
    }
    setFormData({
      type: '',
      name: '',
      location: '',
      phone: '',
      price: '',
      priceUnit: '',
      amenities: [],
      image: null,
      preview: null
    })
    setErrors({})
    setIsEditing(false)
    setEditingId(null)
  }

  return (
    
    <div className="myproperties-container">
      <div className="myproperties-header">
        <h1 className="myproperties-title">
          {isEditing ? 'Edit Property' : 'Add Your Property'}
        </h1>
        <p className="myproperties-subtitle">
          {isEditing ? 'Update your property details' : 'List your property and start welcoming guests'}
        </p>
      </div>

      <form className="property-form" onSubmit={handleSubmit}>
        <h3 className="form-section-title">
          
          <HousePlus size={16} />{" "}
          Property Information
        </h3>

        {/* Property Type - Only show when adding new */}
        {!isEditing && (
          <div className="form-group">
            <label className="form-label">
             <Home size={20} />{" "}
              
              Property Type <span className="required">*</span>
            </label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className={`form-select ${errors.type ? 'error' : ''}`}
            >
              <option value="">-- Select a type --</option>
              <option value="Coucou-Beach">Coucou-Beach</option>
              <option value="guesthouse">Guesthouse</option>
              <option value="residence">Residence</option>
            </select>
            {errors.type && (
              <div className="error-message">{errors.type}</div>
            )}
          </div>
        )}

        {/* Property Name */}
        <div className="form-group">
          <label className="form-label">
            <HouseHeart size={16} />{" "}
            
            Property Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your property name"
            className={`form-input ${errors.name ? 'error' : ''}`}
          />
          {errors.name && (
            <div className="error-message">{errors.name}</div>
          )}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">
            <MapPinHouse size={16} />{" "}
            
            Location <span className="required">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your property location"
            className={`form-input ${errors.location ? 'error' : ''}`}
          />
          {errors.location && (
            <div className="error-message">{errors.location}</div>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">
            <Phone size={16}/>{" "}
            Phone <span className="required">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your property phone"
            className={`form-input ${errors.phone ? 'error' : ''}`}
          />
          {errors.phone && (
            <div className="error-message">{errors.phone}</div>
          )}
        </div>

        {/* Price */}
        <div className="form-group">
          <label className="form-label">
            <DollarSign size={16} />{" "}
            Price <span className="required">*</span>
          </label>
          <div className="price-input-wrapper">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter your property price"
              className={`form-input ${errors.price ? 'error' : ''}`}
              min="0"
              step="0.01"
            />
            {formData.priceUnit && (
              <span className="price-unit-display">
                per {formData.priceUnit}
              </span>
            )}
          </div>
          {errors.price && (
            <div className="error-message">{errors.price}</div>
          )}
        </div>

        {/* Amenities */}
        <div className="form-group">
          <label className="form-label">
            <Star size={16} />{" "}
            Amenities
          </label>
          <select
            multiple
            name="amenities"
            value={formData.amenities}
            onChange={handleAmenitiesChange}
            className="form-select amenities-select"
          >
            {dynamicOptions.map(item => (
              <option key={item.id} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <p className="amenities-hint">Hold Ctrl (Cmd on Mac) to select multiple amenities</p>
        </div>

        {/* Image Upload - Only for new properties */}
        {!isEditing && (
          <div className="form-group">
            <label className="form-label">
              <Image size={16} />{" "}
              Property Image 
            </label>
            <div className="image-upload-wrapper">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="image-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="image-upload-label" >
                <Image size={18} />{" "}
                <span style={{ color: 'white' }}>Choose Image</span>
              </label>
              {errors.image && (
                <div className="error-message">{errors.image}</div>
              )}
              
              {formData.preview && (
                <div className="image-preview-container">
                  <img src={formData.preview} alt="Property Preview" className="image-preview" />
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="image-remove-btn"
                    title="Remove image"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            <RotateCcw size={20} />
            {isEditing ? 'Cancel' : 'Reset'}
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <Save size={20} />
            {isSubmitting ? 'Processing...' : (isEditing ? 'Update Property' : 'Add Property')}
          </button>
        </div>
      </form>

      {/* Properties Table */}
      <div className="properties-list-section">
        <h2 className="list-title">Your Properties</h2>
        
        {loading ? (
          <div className="loading-state">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <Home size={48} />
            <p>No properties found. Add your first property above!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Price</th>
                  <th>Amenities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property._id}>
                    <td>
                      {property.image ? (
                        <img 
                          src={`${backendurl}/${property.image}`} 
                          alt={property.name}
                          className="table-property-image"
                        />
                      ) : (
                        <div className="table-no-image">
                          <Image size={24} />
                        </div>
                      )}
                    </td>
                    <td className="property-name-cell">{property.name}</td>
                    <td>
                      <span className="property-type-badge">{property.type}</span>
                    </td>
                    <td>{property.location}</td>
                    <td>{property.phone}</td>
                    <td className="price-cell">
                      TND {property.price}
                      <span className="price-unit-small">/{property.priceUnit}</span>
                    </td>
                    <td>
                      <div className="amenities-list">
                        {property.amenities && property.amenities.length > 0 ? (
                          <span className="amenities-count">
                            {property.amenities.length} amenities
                          </span>
                        ) : (
                          <span className="no-amenities">None</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleEdit(property)}
                          className="table-action-btn edit-btn"
                          title="Edit property"
                        >
                          <SquarePen size={16} />
                          
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="table-action-btn delete-btn"
                          title="Delete property"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Myproperties