var express = require('express');
var router = express.Router();
var adminController=require('../controller/admincontroller')
const multer = require('multer')
const path=require('path')
const auth=require('../controller/auth')
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
router.get('/',adminController.homepage)
router.get('/dashboard',auth.verifyadmin,adminController.addash)
router.post('/login',adminController.adsigninpost)
router.get('/logout',adminController.Logout)
router.get('/viewusers',auth.verifyadmin,adminController.viewUsers)
router.get('/block-user/:id',adminController.BlockUser)
router.get('/unblock-user/:id',adminController.UnblockUser)
router.get('/view-category',auth.verifyadmin,adminController.viewCategory)
router.get('/add-category',auth.verifyadmin,adminController.category)
router.post('/add-category',auth.verifyadmin,adminController.Addcategory)
router.get('/delete-category/:id',auth.verifyadmin,adminController.DeleteCategory)
router.get('/edit-category/:id',auth.verifyadmin,adminController.Editcategory)
router.post('/edit-category',adminController.Editcategorypost)
router.get('/view-products',auth.verifyadmin,adminController.viewProducts)
router.get('/add-product',auth.verifyadmin,adminController.AddProduct)
router.post('/add-product',upload.array('productImage',4),adminController.AddProductpost)
router.get('/delete-product/:id',adminController.deleteProduct)
router.get('/edit-product/:id',adminController.editProducts)
router.post('/edit-product',upload.fields([
{name:'img0',maxCount:1},
{name:'img1',maxCount:1},
{name:'img2',maxCount:1},
{name:'img3',maxCount:1}
]),adminController.editProductpost)
router.get('/orderview',auth.verifyadmin,adminController.viewOrders)
router.get('/order-details/:id',auth.verifyadmin,adminController.orderDetail)
router.post('/status-submit',auth.verifyadmin,adminController.statusChange)
module.exports = router;
