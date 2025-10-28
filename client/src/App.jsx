import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import NavBar from './components/NavBar'
import { ToastContainer} from 'react-toastify'
import Footer from './components/Footer'
import Booking from './pages/Booking'
import ScrollToTop from './components/ScrollToTop'
import Favoris from './pages/Favoris'
import BookingUser from './pages/BookingUser'
import Myproperties from './pages/Myproperties'
import MyBookers from './pages/MyBookers'
import Profile from './pages/Profile'
import './css/variables.css'
const App = () =>  {
  return (
<div>
  
  <NavBar/>
  <ToastContainer/>
  <ScrollToTop />
  <Routes>
    <Route path='/' element={<Home />}/>
    <Route path='/Login' element={<Login />}/>
    <Route path='/email-verify' element={<EmailVerify />}/>
    <Route path='/reset-password' element={<ResetPassword />}/>
    <Route path='/About-Us' element={<AboutUs />}/>
    <Route path='/Contact' element={<Contact />}/>
    <Route path='/booking' element={<Booking />}/>
    <Route path='/Favoris' element={<Favoris />}/>
    <Route path='/BookingUser' element={<BookingUser />}/>
    <Route path='/MyProperties' element= {<Myproperties />}/>
    <Route path='/MyBookers' element= {<MyBookers/>}/>
    <Route path='/profile' element= {<Profile/>}/>
  </Routes>
  <Footer/>
</div>

  )
}

export default App