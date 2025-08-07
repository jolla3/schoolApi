const express= require('express')
const router= express.Router()
const studentController = require("../controllers/studentController");

// authorization
const{auth,authorizeRoles}= require('../middleware/auth')

router.post('/',auth,authorizeRoles('admin','teacher'),studentController.UploadStudentPhoto,studentController.addStudent)
router.get('/', auth,authorizeRoles('admin','teacher'),studentController.getAllStudents)
// router.get('/:id', 
router.get('/', auth,authorizeRoles('admin','teacher'),studentController.getAllStudents)
router.put('/:id',auth,authorizeRoles("admin"), studentController.updateStudent)
router.delete('/:id',auth,authorizeRoles("admin"), studentController.deleteStudent)


module.exports = router
