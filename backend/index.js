require("dotenv").config();
const User = require("./models/user.model")
const Note = require("./models/note.model")
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));




app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.get("/", (req,res) => {
    res.json({data: "hello"});
});

const { authenticateToken } = require("./utilities")

//create-account
app.post("/create-account", async(req, res) => {

    const {fullName, email, password } = req.body;

    if(!fullName) {
        return res.status(400).json({ error: true, message:"Full Name is required" });
    }
    if(!email) {
        return res.status(400).json({ error: true, message:"Email is required" });
    }
    if(!password) {
        return res.status(400).json({ error: true, message:"Password is required" });
    }

    const isUser = await User.findOne({ email: email});

    if(isUser) {
        return res.json({error:true, message: "User already exists",
        });
    }

    const user = new User({
        fullName,email, password,
    });
    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
    return res.json({
        error:false,
        user,
        accessToken,
        message: "Registration Successful",
    });
 
});
//login
app.post("/login", async(req,res)=>{
    const {email, password} = req.body;

    if(!email) {
        return res.status(400).json({ error: true, message:"Email is required" });
    }
    if(!password) {
        return res.status(400).json({ error: true, message:"Password is required" });
    }

    const userInfo = await User.findOne({email:email});

    if(!userInfo) {
        return res.status(400).json({error:true, message:"User not found"});
    }
    if(userInfo.email==email && userInfo.password==password){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn:"3600m",
        });
    return res.json({
        error:false,
        message:"Login Successful",
        email,
        accessToken,
    });
    }
    else{
        return res.status(400).json({
            error:true,
            message:"Invalid Credentials"
        });
    }

});

//add-note
app.post("/add-note", authenticateToken, async(req, res) => {

    const { title, content, tags, isPinned } = req.body;
    const {user} = req.user;

    if(!title) {
        return res.status(400).json({ error: true, message:"Title is required" });
    }
    if(!content) {
        return res.status(400).json({ error: true, message:"Content is required" });
    }
    if(!tags) {
        return res.status(400).json({ error: true, message:"Tags is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
            isPinned: isPinned
        });
    

    await note.save();
    return res.json({
        error:false,
        note,
        message:"Note added successfully",
    });
    } catch(error) {
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        });
    }
 
});

//edit-note
app.put("/edit-note/:noteId", authenticateToken, async(req,res)=>{
    const noteId = req.params.noteId;
    const { title, tags, content, isPinned} = req.body;
    const {user} = req.user;
    if(!title && !content && !tags){
        return res.status(400).json({
            error:true,message:"No changes provided"
        });
    }

    try{
        const note = await Note.findOne({_id:noteId, userId:user._id});
        if(!note){
            return res.status(404).json({error:true,messaage:"Note not found"});
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;
        await note.save();
        return res.json({
            error:false,note, message:"Note updated successfully"
        });
    } catch(err){
        return res.status(500).json({
            error:true, message:"Internal Server Error"
            
        });
    }
})

//get-all-notes
app.get("/get-all-notes", authenticateToken, async(req, res)=>{
    const { user } = req.user;

    try{
        const notes = await Note.find({userId:user._id}).sort({isPinned: -1});
        return res.json({
            error:false,
            notes,
            message:"All notes retrieved successfully..."
        });
    } catch(err){
        return res.status(500).json({
            error:true,
            message: "Internal Server Error"
        });
    }


});

//delete-note
app.delete("/delete-note/:noteId", authenticateToken, async(req, res)=>{
    const noteId = req.params.noteId;
    const {user} = req.user;
    try{
        const note = await Note.findOne({userId:user._id, _id:noteId});
        if(!note){
            return res.status(404).json({
                error:true,
                message: "Note not found."
            });
        }

        await Note.deleteOne({userId:user._id, _id:noteId});

        return res.json({
            error:false,
            note,
            message:"Note deleted successfully..."
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            error:true,
            message: "Internal Server Error"
        });
    }


});

//update-note-pinned
app.put("/update-note-pinned/:noteId", authenticateToken, async(req,res)=>{
    const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const {user} = req.user;

    try{
        const note = await Note.findOne({_id:noteId, userId:user._id});
        if(!note){
            return res.status(404).json({error:true,messaage:"Note not found"});
        }

        
        note.isPinned = isPinned;
        await note.save();
        return res.json({
            error:false,note, message:"Pin updated successfully"
        });
    } catch(err){
        return res.status(500).json({
            error:true, message:"Internal Server Error"
            
        });
    }
})

//get-user
app.get("/get-user", authenticateToken, async(req, res)=>{
    const { user } = req.user;

    try{
        const isUser = await User.findOne({_id:user._id});
        if(!isUser){
            return res.status(404).json({
                error:true,
                message:"User not found."
            });
        }
        return res.json({
            user:{ fullName:isUser.fullName, email:isUser.email, createdOn:isUser.createdOn}
        });
    } catch(err){
        return res.status(500).json({
            error:true,
            message: "Internal Server Error"
        });
    }


});

app.listen(8000);

module.exports = app;