const {body,validationResult} = require("express-validator") ;

//validation rules
exports.validateCreateNote = [
    // validation rules
    body("title") 
        .notEmpty().withMessage("Title is required") 
        .isLength({min: 3}).withMessage("Title must be at least 3 characters"),
    
    body("content")
        .notEmpty().withMessage("Content is required"),

    // Final middleware to check error
    (req,res,next) =>{
        const errors = validationResult(req) ;

        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0].msg);
        }

        next();
    }
];