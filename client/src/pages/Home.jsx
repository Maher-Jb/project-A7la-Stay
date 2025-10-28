import { useState, useEffect, useContext } from 'react'
import '../css/Home.css'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Home as HomeIconLucide, Building2, Waves, MapPin, Star, Users, Heart, Phone } from 'lucide-react'
import axios from 'axios'

const Home = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentSlide, setCurrentSlide] = useState(0)
  const { userData, propertiesdata, isloggedin, backendurl, favorites, setFavorites } = useContext(AppContent)
  const [SearchValue, setSearchValue] = useState('')
  const [imageErrors, setImageErrors] = useState({})

  const BungalowIcon = () => (
    <Waves className="icon-large" strokeWidth={2} />
  )

  const HomeIcon = () => (
    <HomeIconLucide className="icon-large" strokeWidth={2} />
  )

  const BuildingIcon = () => (
    <Building2 className="icon-large" strokeWidth={2} />
  )

  const MapPinIcon = () => (
    <MapPin className="icon-small" strokeWidth={2} />
  )

  const StarIcon = () => (
    <Star className="icon-small" style={{ color: '#eab308', fill: 'currentColor' }} />
  )

  const UsersIcon = () => (
    <Users className="icon-small" strokeWidth={2} />
  )

  const SmallWavesIcon = () => (
    <Waves className="icon-small" strokeWidth={2} />
  )

  const SmallHomeIcon = () => (
    <HomeIconLucide className="icon-small" strokeWidth={2} />
  )

  const SmallBuildingIcon = () => (
    <Building2 className="icon-small" strokeWidth={2} />
  )

  const slides = [
    {
      type: 'Coucou-Beach',
      title: 'Relax at Our Coucou-Beach Paradise',
      description: 'Experience the perfect Coucou-Beach getaway with stunning ocean views',
      image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: <BungalowIcon />
    },
    {
      type: 'guesthouse',
      title: 'Cozy Guest House Stays',
      description: 'Feel at home with our warm hospitality and comfortable rooms',
      image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: <HomeIcon />
    },
    {
      type: 'residence',
      title: 'Luxury Residence Living',
      description: 'Enjoy premium amenities and elegant accommodations',
      image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: <BuildingIcon />
    }
  ]

  const handleBookNow = (property) => {
    navigate('/booking', { state: { property } })
  }

  const toggleFavorite = async (property) => {
    try {
      const response = await axios.post(`${backendurl}/api/favorites/toggle`, {
        userId: userData.id,
        propertyID: property._id,
        type: property.type,
        name: property.name,
        location: property.location,
        price: property.price,
        priceUnit: property.priceUnit,
        rating: property.rating,
        reviews: property.reviews,
        amenities: property.amenities,
        image: property.image
      })

      const message = response.data.message
      toast.success(message)

      setFavorites(prev =>
        prev.includes(property._id)
          ? prev.filter(id => id !== property._id)
          : [...prev, property._id]
      )
    } catch (err) {
      toast.error("Failed to update favorites")
    }
  }

  const handleImageError = (propertyId) => {
    setImageErrors(prev => ({
      ...prev,
      [propertyId]: true
    }))
  }

  const filteredProperties = (propertiesdata || [])
    .filter(p => activeFilter === 'all' || p.type === activeFilter)
    .filter(p => {
        
        if (!p) return false;

        const search = SearchValue.toLowerCase();
        const nameMatch = (p.name || '').toLowerCase().includes(search);
        const locationMatch = (p.location || '').toLowerCase().includes(search);
        const priceMatch = String(p.price || '').includes(search);
        const ratingMatch = String(p.rating || '').includes(search);
        const reviewsMatch = String(p.reviews || '').includes(search);
        const amenitiesMatch = (p.amenities || []).join(' ').toLowerCase().includes(search);

        return nameMatch || locationMatch || priceMatch || ratingMatch || reviewsMatch || amenitiesMatch;
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="home-container">
      {/* User Greeting */}
      {userData && (
        <div>
          <h1 className="user-greeting">Hello {userData.name}</h1>
        </div>
      )}

      {/* Hero Slider */}
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : 'inactive'}`}
            style={{ background: slide.image }}
          >
            <div className="slide-content">
              <div className="slide-icon">{slide.icon}</div>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-description">{slide.description}</p>
            </div>
          </div>
        ))}
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              aria-pressed={index === currentSlide}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome to Paradise Bookings</h2>
          <p className="welcome-description">
            Discover your perfect getaway in Tunisia. Whether you're seeking a serene Coucou-Beach escape,
            a cozy guest house experience, or luxurious residence living, we have the ideal accommodation waiting for you.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-buttons">
            <button
              onClick={() => setActiveFilter('all')}
              className={`filter-btn all ${activeFilter === 'all' ? 'active' : 'inactive'}`}
              aria-pressed={activeFilter === 'all'}
            >
              All Properties
            </button>
            <button
              onClick={() => setActiveFilter('Coucou-Beach')}
              className={`filter-btn Coucou-Beach ${activeFilter === 'Coucou-Beach' ? 'active' : 'inactive'}`}
              aria-pressed={activeFilter === 'Coucou-Beach'}
            >
              <SmallWavesIcon /> Coucou-Beach
            </button>
            <button
              onClick={() => setActiveFilter('guesthouse')}
              className={`filter-btn guesthouse ${activeFilter === 'guesthouse' ? 'active' : 'inactive'}`}
              aria-pressed={activeFilter === 'guesthouse'}
            >
              <SmallHomeIcon /> Guest Houses
            </button>
            <button
              onClick={() => setActiveFilter('residence')}
              className={`filter-btn residence ${activeFilter === 'residence' ? 'active' : 'inactive'}`}
              aria-pressed={activeFilter === 'residence'}
            >
              <SmallBuildingIcon /> Residences
            </button>
          </div>
        </div>

        {/* Search Container */}
        <div className="search-container">
          <fieldset>
            <legend>Search</legend>
            <input
              type="text"
              value={SearchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for your desire..."
            />
          </fieldset>
        </div>

        {/* Properties Grid */}
        <div className="properties-grid">
          {filteredProperties.map(property => (
            <div key={property._id} className="property-card" data-type={property.type}>
              {/* Property Image */}
              <div className="property-image">
                {property.image && !imageErrors[property._id] ? (
                  <img
                    src={`${backendurl}/${property.image}`}
                    alt={property.name}
                    className="property-img-element"
                    onError={() => handleImageError(property._id)}
                  />
                ) : (
                  <div className="property-image-placeholder">
                    {property.type === 'Coucou-Beach' && <BungalowIcon />}
                    {property.type === 'guesthouse' && <HomeIcon />}
                    {property.type === 'residence' && <BuildingIcon />}
                  </div>
                )}
                {isloggedin && userData.role === "user" && (
                  <div
                    className="favorite-icon"
                    onClick={() => toggleFavorite(property)}
                    title={favorites.includes(property._id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart
                      size={24}
                      fill={favorites.includes(property._id) ? '#ef4444' : 'none'}
                      stroke={favorites.includes(property._id) ? '#ef4444' : 'white'}
                      strokeWidth={2}
                    />
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="property-details">
                <div className="property-header">
                  <div className="property-info">
                    <h3>{property.name}</h3>
                    <div className="property-location">
                      <MapPinIcon />
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating - moved here for consistency */}
                <div className="property-meta">
                  <StarIcon />
                  <span>{property.rating} rating</span>
                </div>

                <div className="property-meta">
                  <UsersIcon />
                  <span>{property.reviews} reviews</span>
                </div>

                <div className="property-meta">
                  <Phone size={15} />
                  <span>{property.phone}</span>
                </div>

                <div className="amenities">
                  {property.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-tag">{amenity}</span>
                  ))}
                </div>

                <div className="property-footer">
                  <div className="property-price">
                    <span className="price-amount">TND {property.price} /</span>
                    <span className="price-period">{property.priceUnit}</span>
                  </div>

                  {isloggedin && (
                    <button onClick={() => handleBookNow(property)} className="book-btn">
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="no-results">
            <p>No properties found in this category.</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="footer-cta">
        <div className="footer-cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Book your dream accommodation today and create unforgettable memories in Tunisia</p>
          {!isloggedin && (
            <button onClick={() => navigate('/login')} className="cta-btn">
              Log in for Booking
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home