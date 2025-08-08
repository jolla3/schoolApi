// entry files
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

// middleware
const app = express()
app.use(express.json())
app.use(cors())
//  static file access
app.use("/uploads", express.static('uploads'))


// login/register routes
const userAuth = require('./routes/loginRoute')
app.use('/api/userAuth', userAuth)

// classroom routes
const classrooms = require('./routes/classroomRouter')
app.use('/api/classroom', classrooms)

const teacher = require('./routes/teacherRouter')
app.use('/api/teacher/', teacher)

const assignments = require('./routes/assigmentRouter')
app.use('/api/assignments', assignments)

const parent = require('./routes/parentRouter')
app.use('/api/parent', parent)

const student = require('./routes/studentRouter')
app.use('/api/student', student);

// admin dash
const admin = require('./routes/admindashboard')
app.use('/api/admin', admin);

// teacherDash
const teacherDashoardRouter = require('./routes/teacherDashRouter')
// const { parentDash } = require('./controllers/parentDashController')
app.use('/api/teacherDash', teacherDashoardRouter);

// parentDash
const parentDashRouter = require('./routes/parentDashRouter')
app.use("/api/parentdash", parentDashRouter)


// mongoose.connection to the db
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connected to MongoDb'))
    .catch(err => console.log("MongoDB connection error", err))


const Port = 3001
app.listen(Port, () => {
    console.log(`server is runing on port ${Port}`)
})
