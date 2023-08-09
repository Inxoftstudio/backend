const express = require('express')
const dbconnect = require("./database")
const { PORT } = require('./config')
const router =  require("./routes") 
const errorHandler = require("./middlewares/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(cors({origin: true, credentials: true}));

app.use(cookieParser())

app.use(express.json({limit: "50mb"}));

dbconnect()

app.use(router);

app.use("/storage", express.static("storage"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`backend app running on port ${PORT}`)
})