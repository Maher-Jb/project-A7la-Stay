import React, { useEffect, useState, useContext } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { MapPin, Star, Users, Heart, HouseHeart, Home as HomeIcon, Building2, Waves } from 'lucide-react'
import '../css/Favorites.css'

// Favorite Card Component
const FavoriteCard = ({ property, backendurl, removeFavorite, handleBookNow }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div key={property.propertyID} className="favorite-card" data-type={property.type}>
      {/* Favorite Image Section */}
      <div className="favorite-image">
        {property.image && !imageError ? (
          <img
            src={`${backendurl}/${property.image}`}
            alt={property.name}
            className="favorite-img-element"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="favorite-image-placeholder">
            {property.type === 'Coucou-Beach' && <Waves className="icon-large" strokeWidth={2} />}
            {property.type === 'guesthouse' && <HomeIcon className="icon-large" strokeWidth={2} />}
            {property.type === 'residence' && <Building2 className="icon-large" strokeWidth={2} />}
          </div>
        )}
        
        {/* Remove Favorite Icon */}
        <div
          className="favorite-icon"
          onClick={() => removeFavorite(property.propertyID)}
          title="Remove from favorites"
        >
          <Heart fill="#ef4444" stroke="#ef4444" size={24} strokeWidth={2} />
        </div>
      </div>

      {/* Favorite Details */}
      <div className="favorite-details">
        <h3>{property.name}</h3>
        
        <div className="property-location">
          <HouseHeart className="icon-small" />
          <span>{property.type}</span>
          <MapPin className="icon-small" />
          <span>{property.location}</span>
        </div>

        <div className="property-rating">
          <Star className="icon-small" style={{ color: '#eab308', fill: 'currentColor' }} />
          <span>{property.rating}</span>
          <Users className="icon-small" />
          <span>{property.reviews} reviews</span>
        </div>

        <div className="property-footer">
          <span className="price">TND {property.price} / {property.priceUnit}</span>
          <button onClick={() => handleBookNow(property)} className="book-btn">
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Favorites Component
const Favorites = () => {
  const { backendurl, userData, getFavorites } = useContext(AppContent)
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    if (!userData?.id) return

    axios.get(`${backendurl}/api/favorites/${userData.id}`)
      .then(res => {
        if (res.data.success) {
          setFavorites(res.data.favorites)
        } else {
          toast.error("Failed to load favorites")
        }
      })
      .catch(err => {
        console.error('Favorites fetch error:', err)
        toast.error("Failed to load favorites")
      })
  }, [userData, backendurl])

  const removeFavorite = async (propertyID) => {
    try {
      const response = await axios.post(`${backendurl}/api/favorites/toggle`, {
        userId: userData.id,
        propertyID
      })
      getFavorites()
      toast.success(response.data.message)
      setFavorites(prev => prev.filter(fav => fav.propertyID !== propertyID))
    } catch (err) {
      console.error('Remove favorite error:', err)
      toast.error("Failed to remove from favorites")
    }
  }

  const handleBookNow = (property) => {
    navigate('/booking', { state: { property } })
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1 className="favorite-title">Your Favorite Properties ❤️</h1>
        <p className="favorite-subtitle">Now you can check and book your favorite properties</p>
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <Heart size={64} className="empty-icon" />
          <h2>No Favorites Yet</h2>
          <p>You haven't added any favorites yet. Start exploring and save your dream properties!</p>
          <button onClick={() => navigate('/')} className="explore-btn">
            Explore Properties
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((property) => (
            <FavoriteCard
              key={property.propertyID}
              property={property}
              backendurl={backendurl}
              removeFavorite={removeFavorite}
              handleBookNow={handleBookNow}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites