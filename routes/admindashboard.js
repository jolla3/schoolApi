const express = require('express')
const router = express.Router()
const admindashController= require('../controllers/admindashboard')
const{auth,authorizeRoles}= require('../middleware/auth')

router.get('/',auth,authorizeRoles('admin'),admindashController.adminDashStats)
// router.get('/',auth, authorizeRoles("admin"),assignmentController.getAllAssigment)


module.exports=router