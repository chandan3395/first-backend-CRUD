require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet") ;
const rateLimit = require("express-rate-limit") ;

const app = express();   // THIS LINE MUST EXIST

// JSON body --> req.body
app.use(express.json());

// connects to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

// route mounting
// Any request starting with /auth will go to authRoutes file.
app.use("/auth", authRoutes);
app.use("/notes",notesRoutes) ;

const errorHandler = require("./middleware/errorMiddleware") ;
app.use(errorHandler) ;

app.use(helmet()) ;

const limiter = rateLimit({
    windowMs: 15*60*1000, // 15 min
    max: 100, // max 100 requests per IP per window
    message: {
        success: false,
        message: "too many requests. Try again later" 
    }
});

app.use("/api/auth",limiter) ;

const PORT = process.env.PORT || 3000 ;

app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`) ;
}) ;
