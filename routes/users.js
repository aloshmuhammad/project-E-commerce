var express = require('express');
const userController = require('../controller/usercontroller');

var router = express.Router();
const auth=require('../controller/auth')
const{verifyUser} =auth
const{homePage,signIn,signUp,logoutUser,signupPost,signinPost,otpLogin,otpPost,otpValid,validateOtp,productPage,cart,addCart,changeQuantity,removeProduct,orderProduct,placeorderPost,successPage,ordersList,vieworderProducts,cancelOrder,otpLoginps,otpPass,otPv,vlidChck,passChck,checkPass,viewAccount,accountPost,viewAllproducts,addressAdd,newAddaddr,addressChange,changeDefault,paypalSucces,SearchData,couponAdd,returnProducts,verifyRazorpay,WishlistView,addWish,removeWish}=userController


/* GET users listing. */
router.get('/', homePage);
router.get('/login',signIn)
router.get('/signup',signUp)
router.get('/logout',logoutUser)
// router.post('/login',(req,res,next)=>

router.post('/signup',signupPost)
router.post('/login',signinPost)
router.get('/otp-login',otpLogin)
router.post('/otp-login',otpPost)
router.get('/otp-validate',otpValid)
router.post('/validate-otp',validateOtp)
router.get('/view-product/:id',verifyUser,productPage)
router.get('/cart',verifyUser, cart)
router.get('/addto-cart/:id',verifyUser,addCart)

router.post('/change-product-quantity',changeQuantity)
router.delete('/remove-from-cart',verifyUser,removeProduct)
router.get('/order-payment',verifyUser,orderProduct)
router.post('/placeorder-submit',placeorderPost)
router.get('/ordersuccess',verifyUser,successPage)
router.get('/orderlist',verifyUser,ordersList)
router.get('/orderdetails/:id',verifyUser,vieworderProducts)
router.get('/orderReturn/:id',verifyUser,returnProducts)
router.post('/cancel-order',verifyUser,cancelOrder)
router.get('/otploginpass',verifyUser,otpLoginps)
router.post('/otploginpasss',otpPass)
router.get('/otpvalidps',verifyUser,otPv)
router.post('/validateotppass',verifyUser,vlidChck)
router.get('/passcheck',verifyUser,passChck)
router.post('/validate-pass',verifyUser,checkPass)
router.get('/myaccount',verifyUser,viewAccount)
router.post('/account-details',verifyUser,accountPost)

router.get('/allproducts',verifyUser,viewAllproducts)
 router.get('/addreses',verifyUser,addressChange)
router.get('/addAddress',verifyUser,addressAdd)
router.post('/address-Submit',verifyUser,newAddaddr)
router.get('/change-Addressorder/:id',verifyUser,changeDefault)
router.get('/successPayment',verifyUser,paypalSucces)
router.get('/productSrch',verifyUser,SearchData)
router.post('/add-Coupon',verifyUser,couponAdd)
router.post('/verifyRazorpay',verifyRazorpay)
router.get('/wishlist',verifyUser,WishlistView)
router.post('/addtoWishlist',verifyUser,addWish)
router.delete('/remove-from-wish',verifyUser,removeWish)





  


module.exports = router;
