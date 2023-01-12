var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
var ejs=require('ejs')
var expressLayouts = require('express-ejs-layouts')
var db=require('./config/connection');
// const accountSid = "AC747f476ab4a199fe300bb38a7a7cd7a6";
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifySid = "VA4d8995d050b8dbd80d04800051f210ca";
// const client = require("twilio")(accountSid, authToken);

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');


var app = express();
app.locals.user=true

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/ad asset')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
// app.use(session({ secret: "key",cookie:{maxAge:600000},saveUninitialized: false, resave: false}));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "key",cookie:{maxAge:6000000},saveUninitialized: false, resave: false}));
db.connect((err)=>
{
 if(err)
 {
   console.log(err);
 }
 else{
   console.log("database connected");
 }
})

app.use('/', usersRouter);
app.use('/admin',adminRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
