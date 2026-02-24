const Note = require("../models/note") ;
const asyncHandler = require("../middleware/asyncHandler") ;

module.exports = asyncHandler (async (req,res,next) => {
    const note = await Note.findById(req.params.id) ;

    if(!note){
        return res.status(404).json({message: "Note not found"}) ;
    }

    // allow admin 
    if(req.user.role === "admin"){
        req.note = note ;
        return next() ;
    }

    // allow owner
    if(note.user.toString() === req.user.id){
        req.note = note ;
        return next() ;
    }

    return res.status(403).json({message: "Access Denied"}) ;
});