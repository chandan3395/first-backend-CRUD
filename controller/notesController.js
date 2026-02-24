// @desc create a note
// @POST /notes
// @access private
const Note = require("../models/note") ;
const asyncHandler = require("../middleware/asyncHandler") ;

exports.createNote = asyncHandler (async (req,res) => {
        const {title,content} = req.body ;

        // creating note
        const note = await Note.create({
            title,
            content,
            // after verifying user, we get the user details right
            // from that details we add the id here
            user: req.user.id
        });

        return res.status(201).json(note) ;
});

// @desc get all notes of logged-in user (with pagination)
// @route GET/notes
// @access private 
exports.getNotes = asyncHandler (async (req, res) => {
        const limit = parseInt(req.query.limit) || 5;
        const cursor = req.query.cursor;
        const search = req.query.search || "";

        const filter = {};

        // if(admin) --> filter = {} ; 
        // if(!admin) --> filter = {user.id} ;
        if(req.user.role !== "admin"){
            filter.user = req.user.id ;
        }

        // Search logic
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        // Cursor logic
        if (cursor) {
            filter._id = { $lt: cursor };
        }

        const notes = await Note.find(filter)
            .sort({ _id: -1 })
            .limit(limit);

        // Determine next cursor
        const nextCursor = notes.length === limit
            ? notes[notes.length - 1]._id
            : null;

        res.status(200).json({
            count: notes.length,
            nextCursor,
            data: notes
        });
});

// @desc get a single note
// @GET /notes/:id [why?? -> :id -> because id is a big random no.]
// @access private 
exports.getNoteById = asyncHandler( async (req,res) =>{
        return res.status(200).json(req.note) ;
}) ;

// @desc update Note
// @route PUT notes/:Id
// @access private
exports.updateNote = asyncHandler( async (req,res) => {
        const note = req.note ;

        const {title,content} = req.body ;
        if (title !== undefined) 
            note.title = title;
        if (content !== undefined) 
            note.content = content;

        const updatedNote = await note.save();

        return res.status(200).json(updatedNote);
});

// @desc deleteNote
// @route DELETE /notes/:id
// @access private 
exports.deleteNote = asyncHandler( async (req,res) => {
        const note = req.note ;

        await note.deleteOne() ;
        return res.status(200).json({message : "deleted note succesfully"});
});


exports.getAdminStats = asyncHandler(async(req,res) =>{
    const userCount = await User.countDocuments();
    const noteCount = await Note.countDocuments();

    res.status(200).json({
        users: userCount,
        notes: noteCount
    });
});

