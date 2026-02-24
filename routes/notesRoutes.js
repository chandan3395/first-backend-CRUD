const express = require("express");
const {createNote,getNoteById,updateNote,getNotes, deleteNote,getAdminStats} = require("../controller/notesController") ;
const {protect} = require("../middleware/protect") ;
const { validateCreateNote } = require("../middleware/noteValidation");
const restrictTo = require("../middleware/restrictTo");
const checkOwnership = require("../middleware/checkOwnership");


// creates a mini router
const router = express.Router();
// CRUD
router.post("/",protect,validateCreateNote,createNote) ;
router.get("/",protect,checkOwnership,getNotes) ;
router.get("/:id",protect,checkOwnership,getNoteById) ;
router.put("/:id",protect,updateNote)
router.delete("/:id".protect,checkOwnership,deleteNote) ;

router.get("/admin", protect, restrictTo("admin"),)
router.get("/admin/stats",protect,restrictTo("admin"),getAdminStats) ;

module.exports = router ;