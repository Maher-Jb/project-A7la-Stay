import express from 'express'
import multer from 'multer'
import { getpropertiesData, AddProperty , getpropertiesByOwner, deleteproperty, updateOwnerProperty} from '../controllers/propertiesController.js'

const PropertiesRouter = express.Router()

// ✅ Configure Multer (store files in "uploads/" folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')  // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage })

// ✅ Routes
PropertiesRouter.get('/', getpropertiesData)
PropertiesRouter.post('/AddProperty', upload.single('image'), AddProperty)
PropertiesRouter.get('/:OwnerId', getpropertiesByOwner)
PropertiesRouter.delete('/:id', deleteproperty)
PropertiesRouter.put('/:id', updateOwnerProperty)

export default PropertiesRouter
