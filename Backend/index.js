require('dotenv').config();
const express=require('express');
const app=express();
const PORT=process.env.PORT || 3000;

const userRouter=require("./routes/users")
const issueRouter=require("./routes/issues");
const alertRouter=require("./routes/alerts");

const {authenticateToken}=require('./middleware/auth')
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const cors=require("cors");


mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log('Connected To MongoDB')
})
.catch((err)=>console.log("Mongo Error",err));

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users",userRouter);
app.use("/api/issues",authenticateToken,issueRouter);
app.use("/api/alerts",authenticateToken,alertRouter)

app.listen(PORT,()=>{console.log(`Server Started at PORT ${PORT}`)})