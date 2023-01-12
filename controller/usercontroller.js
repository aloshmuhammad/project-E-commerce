const { Db, ObjectId } = require('mongodb');
const Adminhelpers = require('../helpers/Adminhelpers');
var userHelper=require('../helpers/Userhelpers');
const router = require('../routes/users');
module.exports = {
homePage: async(req, res, next)=> {
  
  let user= req.session.user
  
  if(user)
  {
    let name=user.firstName
    
    let cartCount=await userHelper.getcartCount(user._id)
    userHelper.getAllproducts().then((products)=>
    {
     
    
      res.render('index',{user,products,cartCount,name});
    })
    
  }
  else{
    userHelper.getAllproducts().then((products)=>
    {
      
    
      res.render('index',{user,products});
    })
    
  }

  },
  signin:(req,res,next)=>
  {  if(req.session.loggedIn)
    {
      
    res.redirect('/')
    }
  else
   {
  res.render('users/signin',{user:false})
   }

  },
  signup:(req,res,next)=>
  {
    if(req.session.loggedIn)
    {
      res.redirect('/')
    }
    else
    {
    res.render('users/signup')
    }
  },
  signuppost:(req,res,next)=>
  {
    userHelper.addUserSignup(req.body).then((user)=>
    { 
    
      
      let olduser=user.status
      if(olduser)
      {
        res.render('users/signup')
      }
      else{
  
      res.render('users/signin',{nouser:true})
      }
    })
  },
  signinpost:(req,res,next)=>
  {
        userHelper.doUserLOgin(req.body).then((response)=>
      {
    
        if(response.status)
        {
          req.session.loggedIn=true;
      req.session.user=response.validuser
          res.redirect('/')
        }
        else{
          res.render('users/signin',{nouser:true,user:false})
        }
      })
      },
      logoutuser:(req,res,next)=>
      {
    
          req.session.loggedIn=false;
         req.session.user=null

  
     res.redirect("/login");
      },
      otplogin:(req,res,next)=>
      {
        res.render('users/otpsign',{user:false})
      },
     otppost: (req,res,next)=>
      {
        userHelper.Dootplogin(req.body).then((response)=>
        {
        if(response.status)
        {
          req.session.user=response.user
        req.session.contactNo=req.body.contactNo
      

         res.render('users/otp-login',{user:false})
        }
        else
        {
         res.render('users/otpsign',{user:false,novalidotp:true})
        }
      })
   },
   otpvalid:(req,res,next)=>
   {
    res.render('users/otp-login',{user:false})
   },
   validateOtp:(req,res,next)=>
   {
    let contactNo=req.session.contactNo

    userHelper.validOtp(req.body,contactNo).then((response)=>
    {
      if(response.valid)
      {
        req.session.loggedIn=true;
        res.redirect('/')
      }
      else{
        res.render('users/otp-login',{user:false,novalidotp:true})
      }
    })
   },
   
   productPage:async(req,res,next)=>
      { 
        let productid=req.params.id
        let userId=req.session.user._id

     let name=req.session.user.firstName
      let cartCount=await userHelper.getcartCount(userId)
      userHelper.viewproductUser(productid).then((products)=>
      {
        res.render('users/productview',{user:true,login:true,products,cartCount,name})
      })
      
    },
  
   

   addCart:async(req,res,next)=>
   {
    productid=req.params.id
    
      userid=req.session.user._id
      
      userHelper.addTocart(productid,userid).then((response)=>
      {
      res.json(response)
      })
      
    },

   cart:async(req,res,next)=>
   {
    
    let Total=await userHelper.getTotal(req.session.user._id)
    
    
    let cartCount=await userHelper.getcartCount(req.session.user._id)
  
    userHelper.cartView(req.session.user._id).then((cartItems)=>
    {
    
      
        res.render('users/cart',{user:true,login:true,cartItems,cartCount,Total})
        
     
      
    })
   },
   changeQuantity:(req,res,next)=>
   {
    
    userHelper.changeProductquantity(req.body).then((response)=>
    {
      res.json(response)
    })
   },
   removeProduct:(req,res,next)=>
   {
    userHelper.removeProductcart(req.body).then((response)=>
    {
     res.json(response)
    })
   },
   orderProduct:async(req,res,next)=>
   {
    let Total=await userHelper.getTotal(req.session.user._id)
    
    userHelper.cartView(req.session.user._id).then((cartItems)=>
    {
      res.render('users/orderpay',{cartItems,Total})
    })
    
   },
   placeorderPost:async(req,res,next)=>
   {
    let user=req.session.user
  
    console.log(req.body);
    let product=await userHelper.getproductList(user._id)
    let productprice=await userHelper.getTotal(user._id)
    let totalamount=productprice[0].total
   
    userHelper.orderPost(req.body,user._id,product,totalamount).then((response)=>
    {
    res.json({status:true})
    })
   },
   successPage:(req,res,next)=>
   {
    res.render('users/ordersucess')
   },
   ordersList:async(req,res,next)=>
   {
    userid=req.session.user._id
   let orders= await userHelper.vieworders(userid)

      res.render('users/orderlist',{orders,user:true})
    
   
   },
   vieworderproducts:async(req,res,next)=>
   {
    let orderedproducts=await userHelper.vieworderedproducts(req.params.id)
    res.render('users/orderdetails',{orderedproducts,user:true})
   },
   cancelOrder:(req,res,next)=>
   {
    userHelper.cancelOrderlist(req.body).then((response)=>
    {
      res.json(response)
    })
   },
   otploginps:(req,res,next)=>
   {
    res.render('users/otploginpass',{user:false})
   },
   otppass:(req,res,next)=>
   {
    userHelper.otppasscheck(req.body).then((response)=>
    {
    if(response.status)
    {
      req.session.user=response.user
    req.session.contactNo=req.body.contactNo
  

     res.render('users/otpvalidpass',{user:false})
    }
    else
    {
     res.render('users/otploginpass',{user:false,novalidotp:true})
    }
  })
   },
   otpv:(req,res,next)=>
   {
    res.render('users/otpvalidpass',{user:false})
   },
   vlidchck:(req,res,next)=>
   {let contactNo=req.session.contactNo
    userHelper.otpvc(req.body,contactNo).then((response)=>
    {
      if(response.valid)
      {
        
        res.render('users/forgotpass',{user:false})
      }
      else{
        res.render('users/otp-login',{user:false,novalidotp:true})
      }
    })
  
   },
   passchck:(req,res,next)=>
   {
    res.render('users/forgotpass')
   },
   checkpass:(req,res,next)=>
   {
    let contactNoo=req.session.contactNo
    userHelper.retypepass(req.body,contactNoo).then((response)=>
    {
      
      res.render('users/forgotpass',{user:false,passchange:true})
    })
   },
   viewAccount:(req,res,next)=>
   {
    let userId=req.session.user_id
    userHelper.editAccount(userId)
    res.render('users/myaccount',{user:true})
   }
   
  }
  

    
  
  

