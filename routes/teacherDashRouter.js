const express = require('express')
const router = express.Router()
const teacherDashController = require("../controllers/teacherDashController");
const { auth, authorizeRoles } = require('../middleware/auth')

// router.get("/",auth,authorizeRoles("teacher"),teacherDashboardController.getTeacherDashboard);
// router.get('/',auth, authorizeRoles("admin"),assignmentController.getAllAssigment)
router.get('/', auth, authorizeRoles('teacher'), teacherDashController.teacherDash)

module.exports = router