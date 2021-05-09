const express=require('express');
const fs=require('fs');
const app=express();
const Log= require('./details');
const bcrypt= require('bcrypt');
const port=7000;


// getting-started mongoose.js
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/logdetail';

mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set("view engine","hbs");

const home=fs.readFileSync('./home.html','utf-8');
const signup=fs.readFileSync('./signup.html','utf-8');
const login=fs.readFileSync('./login.html','utf-8');
const cReg=fs.readFileSync('./confirm.html','utf-8');

app.get('/',(req,res)=>{
    res.send(home);
})
app.get('/signup',(req,res)=>{
    res.send(signup);
})
app.get('/login',(req,res)=>{
    res.send(login);
})
app.post('/login',async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.pass;
        const userdetails= await Log.findOne({email:email});

        bcrypt.compare(password, userdetails.pass, function(err, result) {
            if(result){
                //Details gets displayed in dashboard
                res.render('dashboard',{
                    dashName:userdetails.name,
                    dashE:email,
                    dashMob:userdetails.mob,
                });
                // res.send(userdetails);
            }
            else{
                res.send('Invalid Details');
            }

        });
        
    }
    catch(error){
        res.status(400).send('Invalid details');
    }
    
})
app.post('/signup',async(req,res)=>{
    
    try {
        const password=req.body.pass;
        const cpassword=req.body.cpass;
        if(password===cpassword){

           bcrypt.hash(password, 10, async (err, passhash)=> {
            //    console.log(passhash);
               const det= new Log({
    
                name: req.body.name,
                email: req.body.email,
                pass: passhash,
                cpass: passhash,
                mob: req.body.mob
            });
             const registered= await det.save();
             res.status(201).send(cReg);
            // res.send("ALL set");
            });    
        }
        else{
            res.send('Password doesnot match');
        }
    }
    catch(error){
        res.status(400).send(error);
        // console.log(error);
    }
   
        
   
   
})


app.listen(port,()=>{
    console.log("The server is up and running at localhost:7000");
})





