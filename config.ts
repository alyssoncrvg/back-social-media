import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

dotenv.config();

const config = {
    porta: process.env.PORT || 3000,
    mongo_uri: process.env.MONGO_URI || '',
    jwt_secret: process.env.JWT_SECRET || '',
    refresh_secret: process.env.REFRESH_SECRET || '',
    servidor: process.env.SERVIDOR || '',
    email: process.env.EMAIL || '',
    password: process.env.PASS || '',
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || ''
    },
    jwt_secret_verify: process.env.JWT_SECRET_VERIFY_ACCOUNT || '',
};

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'users',
            format: 'png',
            public_id: req.body.userId,
        };
    }
});

const upload = multer({ storage: storage });

export { upload };
export default config;