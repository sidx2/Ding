const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const authRoutes = require("./routes/AuthenticationRoutes")
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to the database…'))
    .catch((err) => console.error('Connection error:', err));

app.use("/auth", authRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT}`)
})