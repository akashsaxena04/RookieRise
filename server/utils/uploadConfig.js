const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'rookierise_uploads';
    let format = 'jpg'; // default format

    // Determine folder and format based on where this is being uploaded from
    if (file.fieldname === 'resume') {
        folder = 'rookierise_resumes';
        format = 'pdf'; // or whatever format they upload, Cloudinary can handle pdf natively
    } else if (file.fieldname === 'profilePicture' || file.fieldname === 'companyLogo') {
        folder = 'rookierise_images';
    }

    return {
      folder: folder,
      format: format,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = {
  upload,
  cloudinary
};
