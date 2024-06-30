const express=require("express");
const { createAlert, getAlert } = require("../controllers/alerts");
const { isOfficial } = require("../middleware/auth");
const router=express.Router();

router.post("/create",isOfficial,createAlert)
router.get("/",getAlert)

module.exports=router;