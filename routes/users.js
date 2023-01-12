var express = require('express');
const userController = require('../controller/usercontroller');
var userHelper=require('../helpers/Userhelpers')
var router = express.Router();
const accountSid = "AC8ac2c6332729c28573b0c0039258a15f";
const authToken = '00d0c3b74aa62dedf3b6043c5068c362';
const verifySid = 'VA64162928165b69fa61d327c24f6f5fe7 ';
const client = require("twilio")(accountSid, authToken);
const auth=require('../controller/auth')

/* GET users listing. */
router.get('/', userController.homePage);
router.get('/login', userController.signin)
router.get('/signup',userController.signup)
router.get('/logout',userController.logoutuser)
// router.post('/login',(req,res,next)=>
/
router.post('/signup',userController.signuppost)
router.post('/login',userController.signinpost)
router.get('/otp-login',userController.otplogin)
router.post('/otp-login',userController.otppost)
router.get('/otp-validate',userController.otpvalid)
router.post('/validate-otp',userController.validateOtp)
router.get('/view-product/:id',auth.verifyuser,userController.productPage)
router.get('/cart',auth.verifyuser, userController.cart)
router.get('/addto-cart/:id',userController.addCart)
router.post('/change-product-quantity',userController.changeQuantity)
router.post('/remove-from-cart',userController.removeProduct)
router.get('/order-payment',auth.verifyuser,userController.orderProduct)
router.post('/placeorder-submit',userController.placeorderPost)
router.get('/ordersuccess',auth.verifyuser,userController.successPage)
router.get('/orderlist',auth.verifyuser,userController.ordersList)
router.get('/orderdetails/:id',auth.verifyuser,userController.vieworderproducts)
router.post('/cancel-order',userController.cancelOrder)
router.get('/otploginpass',userController.otploginps)
router.post('/otploginpasss',userController.otppass)
router.get('/otpvalidps',userController.otpv)
router.post('/validateotppass',userController.vlidchck)
router.get('/passcheck',userController.passchck)
router.post('/validate-pass',userController.checkpass)
router.get('/myaccount',auth.verifyuser,userController.viewAccount)



  


module.exports = router;
