import dotenv from 'dotenv';

dotenv.config();

const config = {
    porta: process.env.PORT || 3000,
    mongo_uri: process.env.MONGO_URI || ''
};

export default config;