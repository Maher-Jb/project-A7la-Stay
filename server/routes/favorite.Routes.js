import express from "express"
import { toggleFavorite, getFavorites} from "../controllers/favorite.Controller.js"

const favoriteRouter = express.Router()

favoriteRouter.post('/toggle', toggleFavorite)
favoriteRouter.get('/:userId', getFavorites)

export default favoriteRouter
