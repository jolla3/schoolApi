const express = require('express')
const router = express.Router()
const teacherController= require('../controllers/teacherController')
const{auth,authorizeRoles}= require('../middleware/auth')


router.post('/',auth,authorizeRoles("admin"),teacherController.addTeacher)
// teachers associated docs
router.get('/myclasses',auth,teacherController.getMyClasses)
router.get('/myAssigments',auth,authorizeRoles("teacher"),teacherController.getMyAssigments)
router.get('/',auth,authorizeRoles("admin"),teacherController.getAllTeachers)
router.get('/:id',auth,authorizeRoles("admin"),teacherController.getTeacherById)

// router.put('/:me',auth,authorizeRoles("teacher"),teacherController.updateTeacher)
router.put('/:id',auth,authorizeRoles("admin","teacher"),teacherController.updateTeacher)

router.delete('/:id',auth,authorizeRoles("admin"), teacherController.deledtTeacher)
// router.get('/myClasses',auth,authorizeRoles("teacher"), teacherController.getMyClasses)


module.exports= router