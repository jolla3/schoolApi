// entry files
const express = require('express')
const mongoose = require('mongoose')
const cors= require('cors')
require('dotenv').config()

// middleware
const app = express()
app.use(express.json())
app.use(cors())
//  static file access
app.use("/uploads",express.static('uploads'))


// login/register routes
const userAuth=require('./routes/loginRoute')
app.use('/api/userAuth',userAuth)



// mongoose.connection to the db
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('connected to MongoDb'))
.catch(err => console.log("MongoDB connection error",err))


const Port= 3001
app.listen(Port,()=>{
    console.log(`server is runing on port ${Port}`)
})
