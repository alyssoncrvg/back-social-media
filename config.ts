import dotenv from 'dotenv';

dotenv.config();

const config = {
    porta: process.env.PORT || 3000,
    mongo_uri: process.env.MONGO_URI || '',
    jwt_secret: process.env.JWT_SECRET || '',
    refresh_secret: process.env.REFRESH_SECRET || '',
    servidor: process.env.SERVIDOR || '',
    email: process.env.EMAIL || '',
    password: process.env.PASS || '',
};

export default config;