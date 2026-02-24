// creating a route

const express = require("express");

// creates a mini router
const router = express.Router();

const {registerUser,loginUser} = require("../controller/authController");

// when someone calls auth/...
router.post("/register", registerUser);
router.post("/login", loginUser);

const {protect} = require("../middleware/protect") ;

router.get("/profile",protect,(req,res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
})

module.exports = router;
