const express = require('express')
const router = express.Router()
const parentDashController = require("../controllers/parentDashController");
const{auth,authorizeRoles}= require('../middleware/auth')
// const {auth}= require('../middleware/auth')
// 
router.get(
  "/dash",
  auth,
  authorizeRoles("parent"),
  parentDashController.parentDash
);
router.get('/',auth, authorizeRoles('parent'),parentDashController.getClassAssigments)


module.exports=router