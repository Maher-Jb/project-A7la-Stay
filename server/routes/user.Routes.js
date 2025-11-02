import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { Userdata, deleteaccount, updateAccount, GetAllUsers, DeleteUser } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data', userAuth, Userdata)
userRouter.get('/DataUsers', GetAllUsers)          
userRouter.put('/:id', updateAccount)              
userRouter.delete('/account/:id', deleteaccount)   
userRouter.delete('/admin/:id', DeleteUser)        

export default userRouter