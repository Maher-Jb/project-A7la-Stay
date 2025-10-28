import '../css/AboutUs.css'
import beachImg from "../assets/beach.jpg"
import guestHouseImg from "../assets/guesthouse.jpg"
import residenceImg from "../assets/residence.jpg"


const AboutUs = () => {
  return (
    <div className="aboutus-container">
      {/* Header */}
      <div className="aboutus-header">
        <h1>Welcome to A7la Stay! ✨</h1>
        <p>
          Hey there! We’re A7la Stay, your friendly go-to spot for discovering
          and booking the best stays in Tunisia. Let’s make your next getaway
          unforgettable together!
        </p>
      </div>

      {/* Section 1 - Coucoubeach */}
      <div className="aboutus-section">
        <img src={beachImg} alt="Coucoubeach" className="aboutus-image" />
        <div className="aboutus-text">
          <h2>🏖️ Meet Your Perfect Coucoubeach</h2>
          <p>
            Love a day by the sea? Our Coucoubeach spots are all about
            relaxation and fun! We help you find the coziest beachside getaways
            to soak up the sun, swim, or just chill. Book your day pass and
            let’s create some sunny memories!
          </p>
        </div>
      </div>

      {/* Section 2 - Guest Houses */}
      <div className="aboutus-section reverse">
        <div className="aboutus-text">
          <h2>🏡 Stay in Cozy Guest Houses</h2>
          <p>
            Looking for a warm welcome? Our charming guest houses across Tunisia
            offer a home-away-from-home vibe with local hospitality and
            delicious meals. It’s perfect for travelers who love a personal
            touch—come say hi to your hosts!
          </p>
        </div>
        <img src={guestHouseImg} alt="Guest House" className="aboutus-image" />
      </div>

      {/* Section 3 - Residences */}
      <div className="aboutus-section">
        <img src={residenceImg} alt="Residences" className="aboutus-image" />
        <div className="aboutus-text">
          <h2>🏘️ Relax in Spacious Residences</h2>
          <p>
            Traveling with family or friends? Our residences are comfy,
            fully-equipped homes designed for your stay. From stylish apartments
            to roomy villas, book your perfect space and kick back with all the
            amenities you need!
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
