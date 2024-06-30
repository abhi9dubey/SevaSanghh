const express=require("express");
const router=express.Router();

const {listIssues,createIssue,getIssueDetails,toggleIssueLike,updateIssueStatus,getIssueDetail}=require("../controllers/issues");
const { isOfficial } = require("../middleware/auth");
const { createComment, getComments } = require("../controllers/comments");


const multer = require('multer');
const storage = multer.memoryStorage()

const upload = multer({ storage: storage })


router.get('/',listIssues);
router.get("/:id",getIssueDetail);
router.post('/',upload.single('image'),createIssue);
router.get('/:id',getIssueDetails);
router.post('/update/:id',isOfficial,updateIssueStatus)


router.post('/comments/:id',createComment);
router.get('/comments/:id',getComments);

module.exports=router;