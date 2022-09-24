const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const adminmodel = require('./model/adminschema');
const usermodel = require('./model/userschema');
const dusermodel = require('./model/dschema');
const path = require('path');
const fs = require('fs');
var multer  = require('multer')
const bodyparser = require('body-parser')
// const app = express()


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
})
const filefilter = (req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype === 'image/png'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}
var upload = multer({ storage: storage,filefilter: filefilter })



mongoose.connect('mongodb://localhost:27017/userdb',{

})

const db = mongoose.connection;

db.once('open',function(err,result){
    if(!err) console.log('connected')
    else{
        throw err;
    }
})

app.use(express.urlencoded({extended: false}));
app.use(bodyparser.json())
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
// app.use(express.static('public'))

app.get('/',function(req,res){
    res.render('home');
})

// admin
app.get('/add',function(req,res){
    res.render('admininsert');
})

app.post('/addadmin',function(req,res){
    adminmodel.findOne({email: req.body.email})
    .then(user=>{
        if(user) res.render('error',{message: "Email is already registerd"})
        else{
            if(req.body.email==''){
                res.render('error',{mesage: 'Email is Required'});
            }else if(req.body.password==''){
                res.render('error',{message: 'Password require'})
            }
            else{
                const data = adminmodel(req.body);
                data.save((err,docs)=>{
                    if(!err) res.redirect('/')
                    else{
                        res.status(500).render('error',{message: err})
                    }
                })
            }
        }
    }).catch(err=>{
        res.render('error',{message: err})
    })
})

app.get('/login',function(req,res){
    res.render('login');
})

app.post('/success',function(req,res){
    adminmodel.findOne({email: req.body.email})
    .then(user=>{
        if(user){
            if(req.body.password==user.password){
                res.render('loginsuccess');
            }else{
                res.render('error',{message: 'Password does not match'})
            }
        }else{
            res.render('error',{message: 'Email is not Exist'})
        }
    })
})

// user

app.get('/additem',async(req,res)=>{
    res.render('prodinsert')
})

app.post('/addproduct',upload.single('photo'),async(req,res,next)=>{
    
    console.log(req.file);
    const data = usermodel({
        item_id: req.body.item_id,
        item_name: req.body.item_name,
        shipped_by: req.body.shipped_by,
        mobileno: req.body.mobileno,
        address: req.body.address,
        toaddress: req.body.toaddress,
        photo: 'http://localhost:3000/images/'+req.file.filename,
        distance: req.body.distance,
        weight: req.body.weight,
        price: req.body.price,
        deleiverdate: req.body.deleiverdate,
    })
    dusermodel.findOne({ditemid: req.body.item_id})
    .then(duser=>{
        if(!duser){
            data.save((err,docs)=>{
                if(!err){
                    // var dest = fs.createWriteStream('./public/images/' + req.file.path);
                    // var src = fs.createReadStream(req.file.path);
                    // src.pipe(dest);
                    usermodel.find(function(error,result){
                        if(!error) res.render('show',{users: result})
                        else{
                            res.render('error',{message: error})
                        }
                    })
                }
                
                
                else{
                    res.render('error',{message: err})
                }
            })
        }
        else{
            res.render('error',{message: 'Id in delete table'})
        }
    })
    

})

app.get('/delete/:id',function(req,res){
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);


// console.log();
    usermodel.findById(req.params.id,function(err,result){
        
        if(!err) {

            dusermodel.findOne({ditemid: result.item_id})
            .then(user=>{
                if(!user){
                    var data = dusermodel({
                        ditemid: result.item_id,
                        deletetime: date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + date + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds()
                    })

                    data.save()
                    res.render('finaldelete',{user: result})
                }else{
                    res.render('error',{message: 'Already deleted'})
                }
            })
            

            
        }
    })
    
    
        // res.render()
    
    
    
})

app.get('/fdelete/:id',async function(req,res){
    // alert('you want to delete this')
    await usermodel.findByIdAndDelete(req.params.id)
    res.redirect('/additem')
})

app.get('/edit/:id',function(req,res){
    usermodel.findById(req.params.id,function(err,result){
        if(!err) res.render('edit',{user: result})
    })
})

app.post('/updateproduct/:id',async function(req,res){
    await usermodel.findByIdAndUpdate(req.params.id,req.body);
    usermodel.find(function(err,result){
        if(!err) res.render('show',{users: result})
    })
})

// finish

app.get('/showall',function(req,res){
    usermodel.find(function(err,result){
        if(!err) res.render('show',{users: result})
        else{
            res.render('error',{message: err})
        }
    })
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
