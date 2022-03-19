const express = require("express");
const mongoose = require("mongoose");


const app = express()
app.use(express.json())
let connect = ()=>{
  return  mongoose.connect("mongodb://127.0.0.1:27017/BOOK")
}

let bookSchema = new mongoose.Schema(
    {
        section:{type:String,required:true},
        book:{type:String,required:true},
        author:{type:String,required:true},
        firstName:{type:String,required:true},
        lastName:{type:String,required:true},
    },
    {
        timestamps:true
    }
)

let Book = mongoose.model("book",bookSchema)



let userSchema = new mongoose.Schema(
    {   
        body:{type:String,required:true},
        title:{type:String,required:true},
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"book",
            required:true
        }
    },
    {
        timestamps:true
    }
)

let User = mongoose.model("user",userSchema)

let commentSchema = new mongoose.Schema(
    {
        body :{type:String,required:true},
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"book",
            required:true
        },
        postId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"user",
         required:true
        }
    }
)

let Commnet = mongoose.model("comment",commentSchema)



app.get("/book",async(req,res)=>{
    try{
        let book = await Book.find().lean().exec()
        res.send({book:book})
    }
    catch(err){
        res.send({err:err.message})
    }
})


app.post("/book",async(req,res)=>{ 
    try{
        let posts= await Book.create(req.body)
        res.send({posts:posts})
    }
    catch(err){
       res.send({err:err.message})
    }
})


app.get("/book/:id",async(req,res)=>{ 
    try{
    let user = await Book.findById(req.params.id).lean().exec()
    return res.status(200).send({user:user})
    }
    catch(err){
        res.status(500).send({ message: err.message })
    }
})

app.get("/post",async(req,res)=>{
    try{
     let post = await User.find().lean().populate({path:"userId",select:{"firstName":1,_id:0,"lastName":1}}).exec()
     return res.status(200).send({post:post})
    }
    catch(err){
        res.status(500).send({ message: err.message })
    }
}) 
app.post("/post", async (req, res) => {
    try {
      const post = await User.create(req.body);
  
      return res.status(200).send(post);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

app.post("/comment",async(req,res)=>{
    try{
        let com = await Commnet.create(req.body)
        return res.send({com:com})
    }
    catch(err){
        return res.send({err:err.message})
    }
})

app.get("/comment",async(req,res)=>{
    try{
        let com = await Commnet.find().populate({path:"userId",select:"firstName"}).populate({path:"postId",select:"title"}).lean().exec()
       return res.send({com:com})
    }
    catch(err){
        res.send({err:err.message})
    }
})


app.listen(2000,async()=>{
    try{
    await connect()
    }
    catch(err){
        console.log(err)
    }
    console.log("This is portal 5000")
})