const dotenv = require("dotenv").config();

const PORT = process.env.PORT;
const MONOGODB_CONNECTION_STRING = process.env.MONOGODB_CONNECTION_STRING;
const ACCESS_TOKEN_SECRECT = process.env.ACCESS_TOKEN_SECRECT
const REFRESH_TOKEN_SECRECT = process.env.REFRESH_TOKEN_SECRECT
const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

module.exports = {
    PORT,
    MONOGODB_CONNECTION_STRING,
    ACCESS_TOKEN_SECRECT,
    REFRESH_TOKEN_SECRECT,
    CLOUD_NAME,
    API_KEY,
    API_SECRET
}