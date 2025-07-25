const express = require('express')
const router = express.Router()
const assignmentController= require('../controllers/assigmentController')
const{auth,authorizeRoles}= require('../middleware/auth')

router.post('/',auth, assignmentController.addAssigment)
router.get('/',auth, authorizeRoles("admin"),assignmentController.getAllAssigment)

router.get('/:id',auth,assignmentController.getAssigmentById)
router.put('/:id',auth,authorizeRoles("teacher"),assignmentController.updateAssigment)




// router.put('/:id',auth,authorizeRoles("admin","teacher"),teacherController.updateTeacher)
// // router.put('/:id',auth,authorizeRoles("admin","teacher"),teacherController.updateTeacher)

// router.delete('/:id',auth,authorizeRoles("admin"), teacherController.deledtTeacher)
// router.get('/myClasses',auth,authorizeRoles("teacher"), teacherController.getMyClasses)


module.exports=router