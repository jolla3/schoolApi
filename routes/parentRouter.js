const express= require('express')
const router= express.Router()
const parentController= require('../controllers/parentController')

// authorization
const{auth,authorizeRoles}= require('../middleware/auth')

router.post('/',auth,authorizeRoles('admin'), parentController.addParent)
router.get('/all', auth,authorizeRoles('admin'), parentController.getAllParents)
// router.get('/:id', classroomController.getAllClassroomById)
router.put('/:id',auth,authorizeRoles("admin"), parentController.updateParent)
router.delete('/:id',auth,authorizeRoles("admin"), parentController.deleteParent)


module.exports = router
