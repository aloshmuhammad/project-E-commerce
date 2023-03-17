var express = require('express');
var router = express.Router();
var adminController=require('../controller/admincontroller')
const multer = require('multer')
const auth=require('../controller/auth')
const{verifyAdmin}=auth



const{homePage,adDash,adsigninPost,LogOut,viewUsers,blockUser,unblockUser,viewCategory,category,addCategory,deleteCategory,editCategory,editcategoryPost,viewProducts,addProduct,addproductPost,deleteProduct,editProducts,editProductpost,viewOrders,orderDetail,statusChange,downloadReport,AddCoupon,addNewcpn,couponView,DeleteCoupon}=adminController
// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>
//     {
//         cb(null,'./public/productImages')
//     },
    
//         filename:(req,file,cb)=>
//         {
//          console.log(file);
//          const uniqueFilename=Date.now() + "-" + Math.round(Math.random() * 1E9)+ '.jpg' 
//          cb(null,uniqueFilename);
//         }
//     })

    const storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, './public/ad asset/productImages');
        },
        
        filename: (req, file, cb)=>{
            console.log(file);
            const uniqueFileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.jpg';
            cb(null, uniqueFileName);
        }

        // Math.round(Math.random() * 1E9
});
const upload = multer({storage: storage});




/* GET home page. */
router.get('/',homePage)
router.get('/dashboard',verifyAdmin,adDash)
router.post('/login',adsigninPost)
router.get('/logout',LogOut)
router.get('/viewusers',verifyAdmin,viewUsers)
router.get('/block-user/:id',verifyAdmin,blockUser)
router.get('/unblock-user/:id',verifyAdmin,unblockUser)
router.get('/view-category',verifyAdmin,viewCategory)
router.get('/add-category',verifyAdmin,category)
router.post('/add-category',verifyAdmin,addCategory)
router.delete('/delete-category/:id',verifyAdmin,deleteCategory)
router.get('/edit-category/:id',verifyAdmin,editCategory)
router.post('/edit-category',editcategoryPost)
router.get('/view-products',verifyAdmin,viewProducts)
router.get('/add-product',verifyAdmin,addProduct)
router.post('/add-product',upload.array('productImage',4),addproductPost)
router.get('/delete-product/:id',verifyAdmin, deleteProduct)
router.get('/edit-product/:id',verifyAdmin,editProducts)
router.post('/edit-product',upload.fields([
{name:'img0',maxCount:1},
{name:'img1',maxCount:1},
{name:'img2',maxCount:1},
{name:'img3',maxCount:1}
]),editProductpost)
router.get('/orderview',verifyAdmin,viewOrders)
router.get('/order-details/:id',verifyAdmin,orderDetail)
router.post('/status-submit',verifyAdmin,statusChange)
router.get('/sales-report',verifyAdmin,downloadReport)
router.route('/add-coupon')
    .get(verifyAdmin,AddCoupon)
    .post(verifyAdmin,addNewcpn)
router.get('/view-coupons',verifyAdmin,couponView)
router.get('/delete-coupon',verifyAdmin,DeleteCoupon)


module.exports = router;
