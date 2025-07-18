import {v2 as cloudinary} from "cloudinary"

import {config} from 'dotenv'
config()

cloudinary.config({
    cloud_name:process.env.CLOUDDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDDINARY_API_KEY,
    api_secret: process.env.CLOUDDINARY_API_SECRET,
})
export default cloudinary;