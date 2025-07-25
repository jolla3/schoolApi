const express= require('express')
const router= express.Router()
const studentController = require("../controllers/studentController");

// authorization
const{auth,authorizeRoles}= require('../middleware/auth')

router.post('/',auth,authorizeRoles('teacher'),studentController.UploadStudentPhoto,studentController.addStudent)
router.get('/', auth,authorizeRoles('teacher'),studentController.getAllStudents)
// router.get('/:id', 
// router.get('/:id', classroomController.getAllClassroomById)
// router.put('/:id',auth,authorizeRoles("admin"), parentController.updateParent)
// router.delete('/:id',auth,authorizeRoles("admin"), parentController.deleteParent)


module.exports = router
