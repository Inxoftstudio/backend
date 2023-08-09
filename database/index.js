const mongoose = require("mongoose");
const { MONOGODB_CONNECTION_STRING } = require("../config");

const dbconnect = async () => {
    try{
        const conn =  await mongoose.connect(MONOGODB_CONNECTION_STRING);
        console.log(`database connection success  ${conn.connection.host}`)
    }catch(error){
        console.log(`database connection failed ${error}`)
    }
} 

module.exports = dbconnect