import express from 'express'

import userAuth from '../middleware/userAuth.js'
import { Userdata,deleteaccount , updateAccount } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data',userAuth,Userdata)
userRouter.delete('/:id', deleteaccount)
userRouter.put('/:id', updateAccount)

export default userRouter