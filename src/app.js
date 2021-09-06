const express = require('express');
const app = express();
const port  = process.env.PORT || 80;
const path = require('path');
const hbs = require('hbs'); 
const cookieParser = require('cookie-parser');
const staticPath = path.join(__dirname,'../publicdir');
const viewPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname,'../templates/partials');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const session = require('express-session')
var flash = require("connect-flash")
var favicon = require('serve-favicon');
app.set('view engine','hbs');
app.set('views',viewPath);
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(staticPath));
hbs.registerPartials(partialPath);
app.use(favicon(path.join(__dirname,'../publicdir/images','favicon.png')));
app.use(session(
  {
    secret: 'secret',
    cookie: {maxAge :60000},
    resave: false,
    saveUninitialized: false 
  }
)); 
app.use(flash()); 

app.get("/",(req,res)=>{  
  res.render('index');           
});

app.get("/contact",(req,res)=>{ 
  res.render('contact',{message :req.flash('message') });  
}); 
     
app.get("/about",(req,res)=>{  
  res.render('about')            
})          
app.get("/portfolio",(req,res)=>{     
  res.render('portfolio')  
})     
app.get("/aim",(req,res)=>{  
  res.render('aim')  
})

app.post('/contact',body("email").isEmail(),body('name').isLength({ min: 3}),body("phone").isMobilePhone(),body('message').isLength({min: 3 }), async function(req, res) {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
   try{
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const message =req.body.message; 
    const fromMail = 'Hr.adadelhi@gmail.com';
    const toMail = 'arshefalisharma2209@gmail.com,shefalisharma9002@gmail.com';
    const subject  = `Hey Shefali, ${name} have some inquiry.`;
    console.log(name, phone, email, message);
    const text = (`Hi shefali , I am ${name} and i have some inquery : {message} .Please contact me on ${phone} , ${email}`);
    console.log(text)
      //  auth
    const transporter = nodemailer.createTransport({
      service: 'gmail',
        auth: {
        user: 'Hr.adadelhi@gmail.com',
        pass: 'sdesignstudio'
              }
     });
    // email options
    let mailOptions = {
      from: fromMail,
      to: toMail,
      subject: subject,
      text: text
    };
    // send email
    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
          console.log(error);  
      }
      req.flash("message","We will contact you soon.")
      res.redirect("contact");
      
    });
    }

    catch(err){
      res.send(err).status(401);
      }

    });

app.listen(port,() => {
  console.log(` app listening on port ${port}!`)
});