const express= require('express')
const router=express.Router()
const studentController= require('../controllers/studentController')
// authorization
const {auth,authorizeRoles}=require('../middleware/auth')

router.post("/",auth,authorizeRoles("admin"),studentController.uploadStudentPhoto,studentController.addStudent)
router.get('/',auth,studentController.getAllStudents)
router.get('/:id',auth,studentController.getStudentById)
router.put('/:id',auth, authorizeRoles('admin'),studentController.updateStudent)
router.delete('/:id',auth,authorizeRoles('admin'),studentController.deleteStudent)

module.exports=router