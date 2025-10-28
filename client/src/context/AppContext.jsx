import { createContext, useEffect, useState } from "react"
import axios from "axios"
import {toast} from "react-toastify"
export const AppContent = createContext()

export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true

    const backendurl = import.meta.env.VITE_BACKEND_URL
    const [isloggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)
    const [propertiesdata, setPropertiesdata] = useState(false)
    const [favorites, setFavorites] = useState([])
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(false)
    
    const getAuthState = async ()=>{
        try {
            const {data}= await axios.get(backendurl+'/api/auth/is-auth')
            if (data.success){
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    const getUserData = async ()=>{
        try {
            const {data} = await axios.get(backendurl+'/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }


    const getPropertiesData = async () => {
        try {

            const { data } = await axios.get(`${backendurl}/api/data-properties`)
            if (data.success) {
                setPropertiesdata(data.properties)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const getFavorites = async () => {
        if (!userData?.id) return

        try {
            const { data } = await axios.get(`${backendurl}/api/favorites/${userData.id}`)
            if (data.success) {
               
                const favIds = data.favorites.map(f => f.propertyID)
                setFavorites(favIds)
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to load favorites")
        }
    }

const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${backendurl}/api/data-properties/${userData.id}`)
      
      if (response.data.success) {
        setProperties(response.data.OwnerProperties)
      } else {
        toast.error('Failed to fetch properties')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
        getAuthState()
    }, [])

    useEffect(() => {
        if (isloggedin) {

            
            getPropertiesData()
            getFavorites()
            fetchProperties()
        } else {
            
            getPropertiesData()
            setFavorites([]) 
        }
    }, [isloggedin, userData])


    const value = {
        backendurl,
        isloggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        propertiesdata, setPropertiesdata,
        getPropertiesData,
        favorites, setFavorites,
        getFavorites,
        fetchProperties, 
        properties,loading

    }
    
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}