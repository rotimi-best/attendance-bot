require('dotenv').config();

const ENV = process.env;

const MONGO_URI = `${ENV.DB_PROVIDER}://${ENV.DB_USER}:${encodeURIComponent(ENV.DB_PWORD)}@${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`;

module.exports = {
    MONGO_URI
};
