const express =require('express')
const app = express()
const port=3000;
const client = require('./shivam.js')
const mongoose  = require('mongoose')

mongoose.connect('mongodb://localhost:27017/userdb',{

})
const db = mongoose.connection;

db.once('open',function(err,result){
    if(!err){
        console.log('connection done...')

    }
    else{
        throw err
    }
})

// middleware
app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))

// for image handling
const multer = require('multer')
const fs = require('fs')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

// image accessiable on web page
app.use('/upload', express.static('upload'));

// end



app.get('/',function(req,res){
    res.render('home')
})

app.get('/addform',function(req,res){
    res.render('addstudent')
})

// add data
app.post('/add',upload.single('photo'),async(req,res)=>{
    
     client.findOne({email: req.body.email})
     .then(user=>{
        if(user) res.render('error',{message123: 'Student already exist'})
        else if(req.body.id==''){
            res.render('error',{message123: 'Id is required'})
        }
        else{
            const data = client({
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                photo: req.file.originalname,
                fee: req.body.fee,
                datetime: req.body.datetime

            })
            data.save((err,result)=>{
                if(!err){
                    res.redirect('/')
                }
                else{
                    res.render('error',{message123: err})
                }
            })
        }
     })
    
})

// show data
app.get('/show',function(req,res){
    client.find(function(err,result){
        if(!err){
            res.render('showall',{users: result})
        }
        else{
            res.render('error',{message123: err})
        }
    })
})

// delete api
app.get('/delete/:id',async function(req,res){
    await client.findByIdAndDelete(req.params.id);
    res.redirect('/show')
})

// show edit form page
app.get('/edit/:id',function(req,res){
    client.findById(req.params.id,function(err,result){
        if(!err){
            res.render('editform',{edits: result})
        }
        else{
            res.render('error',{message123: err})
        }
    })
})

// edit api
app.post('/orgedit/:id',async function(req,res){
    await client.findByIdAndUpdate(req.params.id,req.body)
    res.redirect('/show')
})


// login
app.get('/check',function(req,res){
    res.render('loginform')
})

app.post('/successidname',async function(req,res){
    client.findOne({id: req.body.id})
    .then(user=>{
        if(user){
            if(user.name===req.body.name){
                res.redirect('/show')
            }else{
                res.render('error',{message123: 'Name Invalid'})
            }
        }else{
            res.render('error',{message123: 'Invalid Id'})
        }
    })
})


app.post('/successnameemail',async function(req,res){
    client.findOne({email: req.body.email})
    .then(user=>{
        if(user){
            if(user.name===req.body.name){
                res.redirect('/show')
            }else{
                res.render('error',{message123: 'Name Invalid'})
            }
        }else{
            res.render('error',{message123: 'Invalid Email'})
        }
    })
})
// end
app.listen(port,function(){
    console.log(`server is running on ${port}`)
})

// .connect()